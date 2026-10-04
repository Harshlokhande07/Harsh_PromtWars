"use client";

import React from "react";
import { History, HelpCircle } from "lucide-react";
import { PreMortem as PreMortemType } from "@/lib/schema";

interface PreMortemProps {
  preMortem: PreMortemType;
}

export const PreMortem: React.FC<PreMortemProps> = ({ preMortem }) => {
  if (!preMortem) return null;

  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <History className="w-4 h-4 text-rose-500" />
          <span>Pre-Mortem Simulation</span>
        </h3>
        <span className="text-xs text-gray-500">Anticipating early blind spots</span>
      </div>

      <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100 space-y-3">
        <div className="text-xs font-semibold text-rose-900 leading-snug">
          <span className="uppercase text-[10px] font-bold text-rose-700 tracking-wider block mb-1">
            Hypothetical Failure Mode:
          </span>
          {preMortem.scenario}
        </div>

        <div className="space-y-2 pt-2 border-t border-rose-100/70">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block">
            Questions to Ask Today to Prevent This:
          </span>
          {preMortem.questions.map((q, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-800 bg-white/90 p-2.5 rounded-lg border border-rose-100">
              <HelpCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
