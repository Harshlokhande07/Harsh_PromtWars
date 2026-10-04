"use client";

import React, { useState } from "react";
import { CheckCheck, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { CoverageResult } from "@/lib/coverage";

interface CoverageMeterProps {
  coverage: CoverageResult;
}

export const CoverageMeter: React.FC<CoverageMeterProps> = ({ coverage }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const isComplete = coverage.percentage === 100 && coverage.totalCards > 0;

  return (
    <div
      className="relative w-full bg-white rounded-xl border border-gray-200 p-3 shadow-xs"
      aria-live="polite"
      aria-label="Review Coverage Meter"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              isComplete
                ? "bg-emerald-100 text-emerald-800"
                : "bg-purple-100 text-purple-700"
            }`}
            aria-hidden="true"
          >
            {isComplete ? <CheckCheck className="w-4 h-4" /> : `${coverage.percentage}%`}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">
                {coverage.reviewedCards} of {coverage.totalCards} reviewed
              </span>
              <span className="text-[11px] text-gray-600 hidden sm:inline">
                • How much of this you&apos;ve reflected on
              </span>
            </div>
            {isComplete ? (
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>You&apos;ve looked at every angle surfaced. The choice remains yours.</span>
              </p>
            ) : (
              <p className="text-[11px] text-gray-600">
                Mark items as you read to track your review thoroughness
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px]"
          aria-expanded={showBreakdown}
          aria-label="Toggle section review breakdown"
        >
          <span className="hidden sm:inline font-medium">Breakdown</span>
          {showBreakdown ? (
            <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Accessible Progress Bar */}
      <div
        className="w-full bg-gray-100 rounded-full h-2 mt-2.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={coverage.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Decision review thoroughness"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-purple-600 to-indigo-600"
          }`}
          style={{ width: `${Math.max(coverage.percentage, 4)}%` }}
        />
      </div>

      {/* Breakdown Details */}
      {showBreakdown && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in duration-200">
          {Object.values(coverage.breakdown).map((sec, idx) => (
            <div key={idx} className="bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="text-[11px] text-gray-700 font-semibold truncate">{sec.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-gray-900">
                  {sec.reviewed}/{sec.total}
                </span>
                <span className="text-[11px] text-purple-700 font-bold">{sec.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
