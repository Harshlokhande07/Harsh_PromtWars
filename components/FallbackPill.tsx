"use client";

import React from "react";
import { Info } from "lucide-react";
import { FallbackReason } from "@/lib/schema";

interface FallbackPillProps {
  mode?: "live" | "fallback";
  fallbackReason?: FallbackReason;
}

const REASON_LABELS: Record<FallbackReason, string> = {
  no_key: "Running offline sample: API key not configured",
  auth_error: "Running offline sample: API key invalid or unauthorized",
  rate_limited: "Running offline sample: API rate limit (429) encountered",
  timeout: "Running offline sample: Request timed out (>25s)",
  network: "Running offline sample: Network connection failed",
  bad_json: "Running offline sample: Malformed JSON from model",
  schema_invalid: "Running offline sample: Schema validation failed",
  guard_failed: "Running offline sample: Guard validation failed",
  model_error: "Running offline sample: AI model provider error",
  forced_demo: "Running in forced Demo mode (?demo=1)",
};

export const FallbackPill: React.FC<FallbackPillProps> = ({ mode, fallbackReason }) => {
  if (mode !== "fallback") return null;

  const tooltipText = fallbackReason
    ? REASON_LABELS[fallbackReason] || `Demo Fallback Mode (${fallbackReason})`
    : "Running with sample data to ensure zero downtime during demonstration";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={tooltipText}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300 shadow-xs cursor-help select-none"
      title={tooltipText}
    >
      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" aria-hidden="true" />
      <span className="font-semibold">Demo Fallback Mode</span>
      {fallbackReason && (
        <span className="text-[10px] text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-bold">
          {fallbackReason}
        </span>
      )}
      <Info className="w-3.5 h-3.5 text-amber-800" aria-hidden="true" />
    </div>
  );
};
