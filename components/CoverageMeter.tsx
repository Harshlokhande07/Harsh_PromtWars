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
    <div className="relative w-full bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
              isComplete
                ? "bg-emerald-100 text-emerald-700"
                : "bg-primary-light text-primary"
            }`}
          >
            {isComplete ? <CheckCheck className="w-4 h-4" /> : `${coverage.percentage}%`}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">
                {coverage.reviewedCards} of {coverage.totalCards} reviewed
              </span>
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                • How much of this you&apos;ve reflected on
              </span>
            </div>
            {isComplete ? (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>You&apos;ve looked at every angle surfaced. The choice remains yours.</span>
              </p>
            ) : (
              <p className="text-[11px] text-gray-400">
                Mark items as you read to track your review thoroughness
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
          aria-expanded={showBreakdown}
        >
          <span className="hidden sm:inline">Breakdown</span>
          {showBreakdown ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mt-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-primary to-indigo-500"
          }`}
          style={{ width: `${Math.max(coverage.percentage, 4)}%` }}
        />
      </div>

      {/* Breakdown Details */}
      {showBreakdown && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in duration-200">
          {Object.values(coverage.breakdown).map((sec, idx) => (
            <div key={idx} className="bg-gray-50/70 p-2 rounded-lg border border-gray-100">
              <div className="text-[11px] text-gray-500 font-medium truncate">{sec.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-gray-800">
                  {sec.reviewed}/{sec.total}
                </span>
                <span className="text-[11px] text-primary font-semibold">{sec.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
