"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";

interface SummaryCardProps {
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 rounded-card p-5 md:p-6 border border-indigo-100 shadow-card">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-primary-light text-primary rounded-xl shrink-0 mt-0.5">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
            1. Your Reasoning (As Understood)
          </h2>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed font-normal">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};
