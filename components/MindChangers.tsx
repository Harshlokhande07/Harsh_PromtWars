"use client";

import React from "react";
import { KeyRound } from "lucide-react";

interface MindChangersProps {
  triggers: string[];
}

export const MindChangers: React.FC<MindChangersProps> = ({ triggers }) => {
  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
          6. What Would Change Your Mind?
        </h2>
        <span className="text-xs text-gray-500">Hypothetical evidence triggers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {triggers.map((trigger, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 flex items-start gap-2.5 text-xs text-gray-800"
          >
            <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{trigger}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
