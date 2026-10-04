"use client";

import React, { useEffect, useState } from "react";
import { Report } from "@/lib/schema";
import { ReflectionState } from "@/lib/coverage";
import { INTERNSHIP_FALLBACK_REPORT, SAMPLE_INTERNSHIP_INPUT } from "@/lib/fallback/internshipReport";
import { Printer, ArrowLeft } from "lucide-react";

interface PrintSessionData {
  userInput: string;
  report: Report;
  reflections: ReflectionState;
  confidenceBefore?: number;
  confidenceAfter?: number;
  timestamp: number;
}

export default function PrintPage() {
  const [data, setData] = useState<PrintSessionData | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bs:print_session");
      if (raw) {
        setData(JSON.parse(raw));
      } else {
        // Fallback demo data if opened directly
        setData({
          userInput: SAMPLE_INTERNSHIP_INPUT,
          report: INTERNSHIP_FALLBACK_REPORT,
          reflections: {},
          confidenceBefore: 6,
          confidenceAfter: 8,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.warn("Could not load print session", err);
    }
  }, []);

  if (!data) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Loading printable report...
      </div>
    );
  }

  const { userInput, report, reflections, confidenceBefore, confidenceAfter } = data;

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 max-w-4xl mx-auto font-sans">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
        <button
          type="button"
          onClick={() => window.close()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow hover:bg-indigo-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print or Save to PDF</span>
        </button>
      </div>

      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">
          The Blind Spot — Thinking Partner Report
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • An exploratory mirror, never advice.
        </p>
      </header>

      {/* Decision context */}
      <section className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200 page-break-inside-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Original Decision Context
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed font-serif italic">
          &ldquo;{userInput}&rdquo;
        </p>
      </section>

      {/* Confidence */}
      {(confidenceBefore !== undefined || confidenceAfter !== undefined) && (
        <section className="mb-6 flex gap-6 text-xs text-gray-700 border-b pb-4 page-break-inside-avoid">
          {confidenceBefore !== undefined && (
            <div>
              <span className="font-semibold">Starting Confidence: </span>
              <span className="font-bold">{confidenceBefore}/10</span>
            </div>
          )}
          {confidenceAfter !== undefined && (
            <div>
              <span className="font-semibold">Post-Reflection Confidence: </span>
              <span className="font-bold">{confidenceAfter}/10</span>
            </div>
          )}
        </section>
      )}

      {/* 1. Reasoning Summary */}
      <section className="mb-6 page-break-inside-avoid">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-2 border-b pb-1">
          1. Your Reasoning (As Understood)
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          {report.reasoningSummary}
        </p>
      </section>

      {/* 2. Unstated Assumptions */}
      <section className="mb-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b pb-1">
          2. Unstated Assumptions
        </h2>
        {report.unstatedAssumptions?.map((a, idx) => {
          const ref = reflections[a.id];
          return (
            <div key={idx} className="p-3 border rounded-lg bg-gray-50/60 page-break-inside-avoid space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">{idx + 1}. {a.assumption}</span>
                {ref?.status && (
                  <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 text-[10px] font-semibold">
                    {ref.status === "hadnt_thought" ? "Hadn't thought of this" : ref.status === "already_considered" ? "Already considered" : "Disagree"}
                  </span>
                )}
              </div>
              <p className="italic text-gray-700 pl-3 border-l-2 border-amber-400">
                &ldquo;{a.groundedQuote}&rdquo;
              </p>
              <p className="text-gray-600"><span className="font-semibold">Why it matters: </span>{a.whyItMatters}</p>
              {ref?.note && <p className="text-indigo-900 font-medium">📝 Note: {ref.note}</p>}
            </div>
          );
        })}
      </section>

      {/* 3. Overlooked Factors */}
      <section className="mb-6 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b pb-1">
          3. Overlooked Factors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {Object.entries(report.overlookedFactors || {}).flatMap(([category, items]) =>
            items.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg bg-gray-50/40 page-break-inside-avoid space-y-1">
                <div className="font-bold text-gray-900">{item.factor}</div>
                <div className="text-gray-600 italic">Probe: {item.probe}</div>
                <div className="text-[10px] text-gray-400 uppercase">{category}</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 4. Reasoning Conflicts */}
      {report.reasoningConflicts?.length > 0 && (
        <section className="mb-6 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b pb-1">
            4. Reasoning Conflicts
          </h2>
          {report.reasoningConflicts.map((c, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-gray-50/50 page-break-inside-avoid text-xs space-y-1">
              <div><span className="font-semibold text-gray-700">Priority: </span>{c.statedPriority}</div>
              <div><span className="font-semibold text-gray-700">Conflict: </span>{c.conflictingSignal}</div>
              <div className="font-medium text-purple-900"><span className="font-bold">Tension: </span>{c.tension}</div>
            </div>
          ))}
        </section>
      )}

      {/* 5. Socratic Questions */}
      <section className="mb-6 page-break-inside-avoid space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b pb-1">
          5. Socratic Questions to Sit With
        </h2>
        <ul className="list-decimal pl-5 text-xs space-y-1.5 text-gray-800">
          {report.socraticQuestions?.map((q, idx) => (
            <li key={idx} className="leading-relaxed">{q}</li>
          ))}
        </ul>
      </section>

      {/* 6. What Would Change Your Mind */}
      {report.whatWouldChangeYourMind?.length > 0 && (
        <section className="mb-6 page-break-inside-avoid space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 border-b pb-1">
            6. What Would Change Your Mind?
          </h2>
          <ul className="list-disc pl-5 text-xs space-y-1 text-gray-800">
            {report.whatWouldChangeYourMind.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. Play the Opposite */}
      {report.oppositeView && (
        <section className="mb-6 page-break-inside-avoid p-4 border rounded-lg bg-amber-50/30 space-y-2 text-xs">
          <h2 className="text-sm font-bold text-amber-900">
            8. Play the Opposite: {report.oppositeView.title}
          </h2>
          <p className="text-gray-800 leading-relaxed">{report.oppositeView.steelman}</p>
          <ul className="list-disc pl-4 text-gray-700 space-y-1 pt-1">
            {report.oppositeView.questionsItRaises.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-4 border-t text-center text-[11px] text-gray-400">
        Generated by The Blind Spot • A structured thinking partner, not financial, legal, or career advice.
      </footer>
    </div>
  );
}
