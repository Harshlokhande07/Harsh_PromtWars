"use client";

import React from "react";
import { Clock, Lightbulb, Key, Briefcase, TrendingUp, Landmark } from "lucide-react";

interface StarterCardsProps {
  onSelectStarter: (text: string) => void;
  disabled?: boolean;
}

export const StarterCards: React.FC<StarterCardsProps> = ({ onSelectStarter, disabled }) => {
  const cards = [
    {
      id: "internship",
      icon: Clock,
      title: "Accept 6-Month Internship",
      description: "Google legacy migration vs early AI startup core learning.",
      fullPrompt:
        "I have two internship offers: Offer A is at Google with great brand name, 80k stipend, but doing legacy migration. Offer B is at an early-stage AI startup with 40k stipend, where the founder promised I will build core agent systems with direct mentorship. My parents want me to take Google for my resume, but I want to actually learn bleeding-edge tech.",
    },
    {
      id: "career",
      icon: Lightbulb,
      title: "Career Switch to AI",
      description: "Senior bank analyst vs founding an AI edtech platform.",
      fullPrompt:
        "I am 28 and currently work as a senior analyst at a corporate bank making $140k with 45-hour weeks and good stability. I am heavily contemplating quitting to start an AI edtech platform with a friend. We have 6 months of savings and no initial funding, but I feel if I don't take this leap now before starting a family, I will regret it forever.",
    },
    {
      id: "loan",
      icon: Key,
      title: "Taking a Loan / Mortgage",
      description: "30-year $450k mortgage vs renting & investing the difference.",
      fullPrompt:
        "My spouse and I are looking at buying our first home with a 30-year mortgage of $450k ($3,200/mo payment, taking 45% of our net monthly take-home). We currently rent for $1,800/mo and invest the difference in index funds. My in-laws strongly believe renting is throwing money away and that real estate always appreciates.",
    },
    {
      id: "startup",
      icon: Briefcase,
      title: "Startup vs Big Tech Job",
      description: "Series-A founding engineer with 1% equity vs safe FAANG RSU role.",
      fullPrompt:
        "I have been offered a founding engineer role at a Series A robotics startup with 1% equity and $110k salary. My current role at Amazon pays $190k base plus $70k annual RSUs with manageable stress. Joining the startup would mean 60-hour weeks and potential equity dilution, but massive ownership.",
    },
    {
      id: "relocation",
      icon: TrendingUp,
      title: "Relocate Overseas vs Stay",
      description: "London HQ international transfer vs staying near aging parents.",
      fullPrompt:
        "My company offered to sponsor my transfer from Bangalore to our London HQ with a 35% nominal pay raise. Living in London has been a lifelong aspiration, but my parents are in their late 60s and living alone. My sibling lives in another city and cannot provide daily support if health issues emerge.",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-wrap justify-center gap-2.5 pt-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectStarter(card.fullPrompt)}
            className="group text-left p-3 rounded-2xl bg-white/70 hover:bg-white border border-slate-100/90 hover:border-purple-200/90 shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex flex-col justify-between space-y-2 w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-7px)]"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-purple-50 text-slate-500 group-hover:text-purple-600 transition-colors flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-800 group-hover:text-purple-900 transition-colors truncate">
                {card.title}
              </h4>
            </div>

            <p className="text-[11px] text-slate-400 group-hover:text-slate-500 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
