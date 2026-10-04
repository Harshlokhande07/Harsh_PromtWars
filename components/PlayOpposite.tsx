"use client";

import React, { useState } from "react";
import { Scale, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { OppositeView } from "@/lib/schema";

interface PlayOppositeProps {
  oppositeView: OppositeView;
}

export const PlayOpposite: React.FC<PlayOppositeProps> = ({ oppositeView }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!oppositeView) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 rounded-card border-2 border-amber-300 shadow-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 md:p-6 flex items-center justify-between text-left hover:bg-amber-50/40 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-label={`Toggle Play the Opposite section: ${oppositeView.title}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs" aria-hidden="true">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                8. Play the Opposite (Steelman View)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                Non-prescriptive
              </span>
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-950 mt-0.5">
              {oppositeView.title}
            </h3>
          </div>
        </div>

        <div className="p-1 rounded-full text-amber-900" aria-hidden="true">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 md:px-6 space-y-4 text-xs md:text-sm text-gray-900 border-t border-amber-200 pt-4 animate-in fade-in duration-200">
          <p className="leading-relaxed bg-white p-4 rounded-xl border border-amber-200 shadow-xs font-normal text-gray-900">
            {oppositeView.steelman}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
              <span>Questions This Alternative Forces You to Answer:</span>
            </h4>
            <div className="space-y-2">
              {oppositeView.questionsItRaises.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-amber-100/60 p-3 rounded-lg border border-amber-200 text-xs text-gray-900 font-medium"
                >
                  <span className="font-bold text-amber-900" aria-hidden="true">•</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
