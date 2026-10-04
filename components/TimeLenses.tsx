"use client";

import React from "react";
import { Hourglass, Calendar, Sparkles } from "lucide-react";
import { TimeLenses as TimeLensesType } from "@/lib/schema";

interface TimeLensesProps {
  timeLenses: TimeLensesType;
}

export const TimeLenses: React.FC<TimeLensesProps> = ({ timeLenses }) => {
  if (!timeLenses) return null;

  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-primary" />
          <span>Time Lenses (10/10/10 Perspective)</span>
        </h3>
        <span className="text-xs text-gray-500">Questions across time horizons</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* 10 Days */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-blue-800 uppercase tracking-wider text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            <span>10 Days In</span>
          </div>
          <p className="text-gray-800 leading-relaxed font-medium">{timeLenses.tenDays}</p>
        </div>

        {/* 10 Months */}
        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-indigo-800 uppercase tracking-wider text-[11px]">
            <Hourglass className="w-3.5 h-3.5" />
            <span>10 Months In</span>
          </div>
          <p className="text-gray-800 leading-relaxed font-medium">{timeLenses.tenMonths}</p>
        </div>

        {/* 10 Years */}
        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-purple-800 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10 Years In</span>
          </div>
          <p className="text-gray-800 leading-relaxed font-medium">{timeLenses.tenYears}</p>
        </div>
      </div>
    </div>
  );
};
