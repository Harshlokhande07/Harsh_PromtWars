"use client";

import React from "react";
import { Compass } from "lucide-react";

export const Skeletons: React.FC = () => {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="w-full space-y-6 animate-in fade-in duration-300"
    >
      <div className="flex items-center justify-center gap-2.5 py-4 text-primary text-sm font-medium">
        <Compass className="w-5 h-5 animate-spin" />
        <span className="animate-pulse font-semibold">
          Examining unstated assumptions, trade-offs, and blind spots...
        </span>
      </div>

      {/* Summary Card Skeleton */}
      <div className="bg-white rounded-card p-6 border border-indigo-100 shadow-soft space-y-3">
        <div className="h-4 w-44 bg-gray-200 rounded-md animate-shimmer" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-gray-100 rounded-md animate-shimmer" />
          <div className="h-3.5 w-5/6 bg-gray-100 rounded-md animate-shimmer" />
        </div>
      </div>

      {/* Assumptions Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-card p-5 border border-gray-200 shadow-soft space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded animate-shimmer" />
              <div className="h-4 w-12 bg-amber-100 rounded-full" />
            </div>
            <div className="h-14 w-full bg-amber-50/50 rounded-xl border border-amber-100 animate-shimmer" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded animate-shimmer" />
              <div className="h-3 w-4/5 bg-gray-100 rounded animate-shimmer" />
            </div>
            <div className="h-8 w-full bg-gray-50 rounded-lg animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Factors Skeleton */}
      <div className="bg-white rounded-card p-6 border border-gray-200 shadow-soft space-y-4">
        <div className="h-4 w-48 bg-gray-200 rounded animate-shimmer" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="h-7 w-24 bg-gray-100 rounded-full animate-shimmer" />
          ))}
        </div>
        <div className="h-20 w-full bg-gray-50 rounded-xl animate-shimmer" />
      </div>
    </div>
  );
};
