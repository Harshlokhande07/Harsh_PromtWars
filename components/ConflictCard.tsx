"use client";

import React from "react";
import { GitCompare, ArrowRightLeft } from "lucide-react";
import { Conflict } from "@/lib/schema";
import { CardReflection, ReflectionStatus } from "@/lib/coverage";
import { ReflectionControls } from "./ReflectionControls";

interface ConflictCardProps {
  conflict: Conflict;
  index: number;
  reflection?: CardReflection;
  onReflectionChange: (cardId: string, status?: ReflectionStatus, note?: string) => void;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({
  conflict,
  index,
  reflection,
  onReflectionChange,
}) => {
  return (
    <div className="bg-white rounded-card p-5 border border-gray-200 shadow-card flex flex-col justify-between space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-900">
              Reasoning Tension
            </span>
          </div>
          <GitCompare className="w-4 h-4 text-purple-500" />
        </div>

        {/* 2-column comparative layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/70 space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
              Stated Priority
            </span>
            <p className="text-gray-800 font-medium leading-snug">{conflict.statedPriority}</p>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/70 space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Conflicting Signal
            </span>
            <p className="text-gray-800 font-medium leading-snug">{conflict.conflictingSignal}</p>
          </div>
        </div>

        {/* Tension line */}
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2 text-xs text-gray-700">
          <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-900">The Core Tension: </span>
            <span>{conflict.tension}</span>
          </div>
        </div>
      </div>

      <ReflectionControls
        cardId={conflict.id}
        reflection={reflection}
        onChange={onReflectionChange}
      />
    </div>
  );
};
