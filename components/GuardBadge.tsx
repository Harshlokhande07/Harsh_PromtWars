"use client";

import React, { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { GuardReport } from "@/lib/schema";

interface GuardBadgeProps {
  guardReport?: GuardReport;
}

export const GuardBadge: React.FC<GuardBadgeProps> = ({ guardReport }) => {
  const [expanded, setExpanded] = useState(false);

  const scrubbedCount = guardReport?.scrubbed ?? 0;
  const rules = guardReport?.rules ?? [];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
        aria-expanded={expanded}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>
          Neutrality Guard: {scrubbedCount > 0 ? `${scrubbedCount} neutralized` : "100% Verdict-Free"}
        </span>
        {rules.length > 0 && (
          expanded ? <ChevronUp className="w-3 h-3 text-emerald-600" /> : <ChevronDown className="w-3 h-3 text-emerald-600" />
        )}
      </button>

      {expanded && rules.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white p-3 shadow-lg border border-gray-200 z-50 text-xs text-gray-700">
          <p className="font-semibold text-gray-900 mb-1">Scrubbed Directives:</p>
          <ul className="list-disc pl-4 space-y-1 text-gray-600">
            {rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-gray-500 border-t pt-1.5">
            Two-layer guarantee: System Prompt + Server-side string parser prevent directive advice.
          </p>
        </div>
      )}
    </div>
  );
};
