"use client";

import React from "react";
import { Users2, MessageCircleQuestion } from "lucide-react";
import { StakeholderVoice } from "@/lib/schema";

interface StakeholderVoicesProps {
  voices: StakeholderVoice[];
}

export const StakeholderVoices: React.FC<StakeholderVoicesProps> = ({ voices }) => {
  if (!voices || voices.length === 0) return null;

  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
          <Users2 className="w-4 h-4 text-emerald-600" />
          <span>Stakeholder Voices</span>
        </h3>
        <span className="text-xs text-gray-500">Concerns from impacted people</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {voices.map((voice, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between space-y-2 text-xs"
          >
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold uppercase tracking-wider text-[11px]">
              <MessageCircleQuestion className="w-3.5 h-3.5 text-emerald-600" />
              <span>{voice.who}</span>
            </div>
            <p className="text-gray-800 italic leading-relaxed">
              &ldquo;{voice.theirConcernAsQuestion}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
