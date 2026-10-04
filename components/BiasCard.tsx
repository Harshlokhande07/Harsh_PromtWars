"use client";

import React from "react";
import { Eye, Quote } from "lucide-react";
import { Bias } from "@/lib/schema";
import { CardReflection, ReflectionStatus } from "@/lib/coverage";
import { ReflectionControls } from "./ReflectionControls";

interface BiasCardProps {
  bias: Bias;
  reflection?: CardReflection;
  onReflectionChange: (cardId: string, status?: ReflectionStatus, note?: string) => void;
}

export const BiasCard: React.FC<BiasCardProps> = ({
  bias,
  reflection,
  onReflectionChange,
}) => {
  return (
    <div className="bg-white rounded-card p-5 border border-gray-200 shadow-card flex flex-col justify-between space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-100 text-amber-800 rounded-md">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">{bias.name}</h3>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Cognitive Tendency
          </span>
        </div>

        <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          {bias.plainDefinition}
        </p>

        {bias.groundedQuote && (
          <div className="bg-amber-50/50 rounded-lg p-2.5 border-l-2 border-amber-400 text-xs text-gray-800 space-y-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase">
              <Quote className="w-3 h-3 text-amber-600" />
              <span>Evidence in your words:</span>
            </div>
            <p className="font-serif italic text-gray-900">&ldquo;{bias.groundedQuote}&rdquo;</p>
          </div>
        )}

        <div className="text-xs text-gray-700 leading-relaxed">
          <span className="font-semibold text-gray-900">How it may show up: </span>
          {bias.howItMayShowUp}
        </div>
      </div>

      <ReflectionControls
        cardId={bias.id}
        reflection={reflection}
        onChange={onReflectionChange}
      />
    </div>
  );
};
