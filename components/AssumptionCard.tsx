"use client";

import React from "react";
import { Quote, AlertTriangle } from "lucide-react";
import { Assumption } from "@/lib/schema";
import { CardReflection, ReflectionStatus } from "@/lib/coverage";
import { ReflectionControls } from "./ReflectionControls";

interface AssumptionCardProps {
  assumption: Assumption;
  index: number;
  reflection?: CardReflection;
  onReflectionChange: (cardId: string, status?: ReflectionStatus, note?: string) => void;
}

export const AssumptionCard: React.FC<AssumptionCardProps> = ({
  assumption,
  index,
  reflection,
  onReflectionChange,
}) => {
  return (
    <div className="bg-white rounded-card p-5 border border-gray-200 hover:border-amber-200 transition-all shadow-card flex flex-col justify-between space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Implicit Assumption
            </span>
          </div>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>

        <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-snug">
          {assumption.assumption}
        </h3>

        {/* Verbatim Grounded Quote */}
        <div className="bg-amber-50/60 rounded-xl p-3 border-l-4 border-amber-400 text-xs text-gray-800 italic space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 not-italic uppercase tracking-wide">
            <Quote className="w-3 h-3 text-amber-600" />
            <span>Grounded in your words:</span>
          </div>
          <p className="pl-4 font-serif text-gray-900">&ldquo;{assumption.groundedQuote}&rdquo;</p>
        </div>

        {/* Why It Matters */}
        <div className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-700">Why this matters: </span>
          {assumption.whyItMatters}
        </div>
      </div>

      {/* Reflection Controls */}
      <ReflectionControls
        cardId={assumption.id}
        reflection={reflection}
        onChange={onReflectionChange}
      />
    </div>
  );
};
