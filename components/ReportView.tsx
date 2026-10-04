"use client";

import React, { useState } from "react";
import { PlusCircle, RefreshCw, Layers } from "lucide-react";
import { Report } from "@/lib/schema";
import { ReflectionState, calculateCoverage, ReflectionStatus } from "@/lib/coverage";
import { SummaryCard } from "./SummaryCard";
import { AssumptionCard } from "./AssumptionCard";
import { FactorGroup } from "./FactorGroup";
import { ConflictCard } from "./ConflictCard";
import { QuestionList } from "./QuestionList";
import { MindChangers } from "./MindChangers";
import { BiasCard } from "./BiasCard";
import { PlayOpposite } from "./PlayOpposite";
import { TimeLenses } from "./TimeLenses";
import { PreMortem } from "./PreMortem";
import { StakeholderVoices } from "./StakeholderVoices";
import { ConfidenceSlider } from "./ConfidenceSlider";
import { CoverageMeter } from "./CoverageMeter";
import { ExportBar } from "./ExportBar";
import { FallbackPill } from "./FallbackPill";
import { GuardBadge } from "./GuardBadge";

interface ReportViewProps {
  report: Report;
  userInput: string;
  reflections: ReflectionState;
  onReflectionChange: (cardId: string, status?: ReflectionStatus, note?: string) => void;
  confidenceBefore: number;
  confidenceAfter: number;
  onConfidenceBeforeChange: (val: number) => void;
  onConfidenceAfterChange: (val: number) => void;
  onReAnalyzeWithNewInfo: (newInfo: string) => void;
  isLoading?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  userInput,
  reflections,
  onReflectionChange,
  confidenceBefore,
  confidenceAfter,
  onConfidenceBeforeChange,
  onConfidenceAfterChange,
  onReAnalyzeWithNewInfo,
  isLoading,
}) => {
  const [newInfoText, setNewInfoText] = useState("");
  const [showAddInfo, setShowAddInfo] = useState(false);

  const coverage = calculateCoverage(report, reflections);

  const handleReRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInfoText.trim()) return;
    const combined = `${userInput.trim()}\n\n[New information added: ${newInfoText.trim()}]`;
    onReAnalyzeWithNewInfo(combined);
    setNewInfoText("");
    setShowAddInfo(false);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Sticky Header Bar */}
      <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-gray-200 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <FallbackPill mode={report.meta?.mode} fallbackReason={report.meta?.fallbackReason} />
            <GuardBadge guardReport={report.meta?.guardReport} />
          </div>

          <ExportBar
            userInput={userInput}
            report={report}
            reflections={reflections}
            confidenceBefore={confidenceBefore}
            confidenceAfter={confidenceAfter}
          />
        </div>

        <CoverageMeter coverage={coverage} />
      </div>

      {/* 1. Reasoning Summary */}
      <SummaryCard summary={report.reasoningSummary} />

      {/* 2. Unstated Assumptions */}
      {report.unstatedAssumptions && report.unstatedAssumptions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              2. Unstated Assumptions
            </h2>
            <span className="text-xs text-gray-500">
              Grounded directly in what you wrote
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.unstatedAssumptions.map((assump, idx) => (
              <AssumptionCard
                key={assump.id}
                assumption={assump}
                index={idx}
                reflection={reflections[assump.id]}
                onReflectionChange={onReflectionChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Overlooked Factors */}
      {report.overlookedFactors && (
        <FactorGroup
          factors={report.overlookedFactors}
          reflections={reflections}
          onReflectionChange={onReflectionChange}
        />
      )}

      {/* 4. Reasoning Conflicts */}
      {report.reasoningConflicts && report.reasoningConflicts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              4. Reasoning Conflicts
            </h2>
            <span className="text-xs text-gray-500">
              Tensions between stated priorities and choices
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.reasoningConflicts.map((conflict, idx) => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                index={idx}
                reflection={reflections[conflict.id]}
                onReflectionChange={onReflectionChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Socratic Questions */}
      {report.socraticQuestions && report.socraticQuestions.length > 0 && (
        <QuestionList questions={report.socraticQuestions} />
      )}

      {/* 6. What Would Change Your Mind */}
      {report.whatWouldChangeYourMind && report.whatWouldChangeYourMind.length > 0 && (
        <MindChangers triggers={report.whatWouldChangeYourMind} />
      )}

      {/* 7. Cognitive Biases */}
      {report.cognitiveBiases && report.cognitiveBiases.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              7. Possible Cognitive Biases
            </h2>
            <span className="text-xs text-gray-500">
              Mental shortcuts that might be shaping perspective
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.cognitiveBiases.map((bias) => (
              <BiasCard
                key={bias.id}
                bias={bias}
                reflection={reflections[bias.id]}
                onReflectionChange={onReflectionChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* 8. Play the Opposite */}
      {report.oppositeView && <PlayOpposite oppositeView={report.oppositeView} />}

      {/* 9. Perspectives & Time Lenses */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Layers className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            9. Strategic Perspectives & Lenses
          </h2>
        </div>

        {report.timeLenses && <TimeLenses timeLenses={report.timeLenses} />}
        {report.preMortem && <PreMortem preMortem={report.preMortem} />}
        {report.stakeholderVoices && <StakeholderVoices voices={report.stakeholderVoices} />}
      </div>

      {/* 10. Confidence Check */}
      <ConfidenceSlider
        confidenceBefore={confidenceBefore}
        confidenceAfter={confidenceAfter}
        onBeforeChange={onConfidenceBeforeChange}
        onAfterChange={onConfidenceAfterChange}
      />

      {/* 11. Add New Info & Re-run */}
      <div className="bg-white rounded-card p-5 border border-gray-200 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-gray-900">
              Learned something new or changed a constraint?
            </h3>
            <p className="text-xs text-gray-500">
              Add new context to update the blind-spot analysis.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddInfo(!showAddInfo)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            <span>{showAddInfo ? "Hide" : "Add Info & Re-run"}</span>
          </button>
        </div>

        {showAddInfo && (
          <form onSubmit={handleReRun} className="pt-3 border-t border-gray-100 space-y-3 animate-in fade-in duration-200">
            <textarea
              rows={3}
              value={newInfoText}
              onChange={(e) => setNewInfoText(e.target.value)}
              placeholder="e.g. 'I just found out the startup's runway is 18 months instead of 6...' or 'The Big Tech team offered a flexible remote day...'"
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newInfoText.trim() || isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-btn shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Re-analyze with Updated Info</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
