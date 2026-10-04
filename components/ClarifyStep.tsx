"use client";

import React, { useState } from "react";
import { HelpCircle, ArrowRight, CornerDownRight } from "lucide-react";
import { ClarifyResponse } from "@/lib/schema";

interface ClarifyStepProps {
  clarifyData: ClarifyResponse;
  originalText: string;
  onContinueWithAnswers: (enrichedText: string) => void;
  onForceContinue: () => void;
  isLoading?: boolean;
}

export const ClarifyStep: React.FC<ClarifyStepProps> = ({
  clarifyData,
  originalText,
  onContinueWithAnswers,
  onForceContinue,
  isLoading,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (index: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [index]: val }));
  };

  const handleSubmitAnswers = (e: React.FormEvent) => {
    e.preventDefault();
    const additions = clarifyData.questions
      .map((q, idx) => {
        const ans = answers[idx]?.trim();
        return ans ? `\n- Regarding "${q}": ${ans}` : "";
      })
      .filter(Boolean)
      .join("");

    const enriched = `${originalText.trim()}\n${additions}`.trim();
    onContinueWithAnswers(enriched);
  };

  return (
    <div className="w-full bg-white rounded-card p-6 shadow-card border-2 border-indigo-100 animate-in fade-in duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-50 text-primary rounded-xl shrink-0 mt-0.5">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">
            A quick moment to sharpen the picture
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {clarifyData.reason || "Your decision description is brief. Adding a little more context helps surface much deeper, grounded blind spots."}
          </p>

          <form onSubmit={handleSubmitAnswers} className="mt-4 space-y-4">
            {clarifyData.questions.map((question, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-primary" />
                  <span>{question}</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. key details, stakes, or alternatives..."
                  value={answers[idx] || ""}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  disabled={isLoading}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50/50"
                />
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-btn shadow-sm transition-all"
              >
                <span>Add Details & Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onForceContinue}
                disabled={isLoading}
                className="text-xs font-medium text-gray-500 hover:text-gray-800 underline underline-offset-4 py-1"
              >
                Continue anyway with original input →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
