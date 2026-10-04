"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface StarterOption {
  id: string;
  label: string;
  emoji: string;
  text: string;
}

export const STARTER_OPTIONS: StarterOption[] = [
  {
    id: "internship",
    label: "Internship Offer",
    emoji: "🎓",
    text: "I have two internship offers: Offer A is at Google with great brand name, 80k stipend, but doing legacy migration. Offer B is at an early-stage AI startup with 40k stipend, where the founder promised I will build core agent systems with direct mentorship. My parents want me to take Google for my resume, but I want to actually learn bleeding-edge tech.",
  },
  {
    id: "career",
    label: "Career Switch",
    emoji: "💼",
    text: "I am 28 and currently work as a senior analyst at a corporate bank making $140k with 45-hour weeks and good stability. I am heavily contemplating quitting to start an AI edtech platform with a friend. We have 6 months of savings and no initial funding, but I feel if I don't take this leap now before starting a family, I will regret it forever.",
  },
  {
    id: "loan",
    label: "Taking a Loan",
    emoji: "🏠",
    text: "My spouse and I are looking at buying our first home with a 30-year mortgage of $450k ($3,200/mo payment, taking 45% of our net monthly take-home). We currently rent for $1,800/mo and invest the difference in index funds. My in-laws strongly believe renting is throwing money away and that real estate always appreciates.",
  },
  {
    id: "startup_vs_job",
    label: "Startup vs Big Tech",
    emoji: "🚀",
    text: "I received an offer to join a Series-A funded robotics startup as Founding Engineer (1.5% equity, lower base) versus an L5 Senior Software Engineer offer at Microsoft (higher base, liquid RSUs, remote flexibility). I crave high impact and fast growth, but the startup's runway is only 14 months in this tough venture market.",
  },
  {
    id: "relocation",
    label: "Relocation Dilemma",
    emoji: "✈️",
    text: "I got an internal transfer opportunity from Bangalore to our London headquarters. It comes with a 2x salary bump on paper and international exposure. However, my parents are in their late 60s with emerging health needs, London cost of living is triple, and my partner would have to pause their career for at least a year until their visa allows work.",
  },
];

interface ExampleStartersProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export const ExampleStarters: React.FC<ExampleStartersProps> = ({ onSelect, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>1-Click Decision Starters</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {STARTER_OPTIONS.map((starter) => (
          <button
            key={starter.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(starter.text)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:border-primary hover:bg-primary-light/40 hover:text-primary transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{starter.emoji}</span>
            <span>{starter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
