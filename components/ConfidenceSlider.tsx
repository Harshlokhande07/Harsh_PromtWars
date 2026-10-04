"use client";

import React from "react";
import { Sliders } from "lucide-react";

interface ConfidenceSliderProps {
  confidenceBefore?: number;
  confidenceAfter?: number;
  onBeforeChange: (val: number) => void;
  onAfterChange: (val: number) => void;
}

export const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({
  confidenceBefore = 5,
  confidenceAfter = 5,
  onBeforeChange,
  onAfterChange,
}) => {
  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <span>Confidence Check</span>
        </h3>
        <span className="text-[11px] text-gray-400">
          Your own self-rating • Not assessed by AI
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Before Reflection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Before Reflection:</span>
            <span className="font-bold text-primary text-sm">{confidenceBefore} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={confidenceBefore}
            onChange={(e) => onBeforeChange(parseInt(e.target.value, 10))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Very Uncertain (1)</span>
            <span>Completely Certain (10)</span>
          </div>
        </div>

        {/* After Reflection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">After Reflection:</span>
            <span className="font-bold text-emerald-600 text-sm">{confidenceAfter} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={confidenceAfter}
            onChange={(e) => onAfterChange(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>More Questions (1)</span>
            <span>Clearer Perspective (10)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
