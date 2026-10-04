"use client";

import React, { useState } from "react";
import {
  Clock,
  TrendingUp,
  Users,
  ShieldAlert,
  Repeat,
  Scale,
  HelpCircle,
} from "lucide-react";
import { OverlookedFactors } from "@/lib/schema";
import { CardReflection, ReflectionStatus } from "@/lib/coverage";
import { ReflectionControls } from "./ReflectionControls";

interface FactorGroupProps {
  factors: OverlookedFactors;
  reflections: Record<string, CardReflection>;
  onReflectionChange: (cardId: string, status?: ReflectionStatus, note?: string) => void;
}

const CATEGORY_TABS: Array<{
  id: keyof OverlookedFactors;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "shortTerm", label: "Short-Term", icon: Clock },
  { id: "longTerm", label: "Long-Term", icon: TrendingUp },
  { id: "affectedPeople", label: "Affected People", icon: Users },
  { id: "hiddenRisks", label: "Hidden Risks", icon: ShieldAlert },
  { id: "opportunityCost", label: "Opportunity Cost", icon: Scale },
  { id: "reversibility", label: "Reversibility", icon: Repeat },
];

export const FactorGroup: React.FC<FactorGroupProps> = ({
  factors,
  reflections,
  onReflectionChange,
}) => {
  const [activeTab, setActiveTab] = useState<keyof OverlookedFactors>("shortTerm");

  const currentItems = factors[activeTab] || [];

  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
          3. Overlooked Factors
        </h2>
        <span className="text-xs text-gray-500">
          6 critical dimensions frequently unexamined
        </span>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-2 px-2 no-scrollbar">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const itemsCount = factors[tab.id]?.length || 0;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {itemsCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Item List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-gray-900">{item.factor}</h4>
              <div className="flex items-start gap-1.5 text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-100">
                <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item.probe}</span>
              </div>
            </div>

            <ReflectionControls
              cardId={item.id}
              reflection={reflections[item.id]}
              onChange={onReflectionChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
