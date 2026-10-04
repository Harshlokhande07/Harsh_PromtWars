"use client";

import React from "react";
import { Orb3D } from "./Orb3D";

interface HeroProps {
  userName?: string;
  hasReport?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ userName = "Harsh", hasReport }) => {
  if (hasReport) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center pt-2 pb-6 space-y-3 select-none animate-in fade-in duration-500">
      {/* 3D Luminous Interactive Animated Orb Graphic */}
      <Orb3D />

      {/* Shimmering Animated Greeting Pill for Name */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50/90 border border-purple-200/80 shadow-xs backdrop-blur-xs animate-float-gentle transition-all hover:scale-105 cursor-default">
        <span className="text-sm inline-block animate-pulse" aria-hidden="true">
          ✨
        </span>
        <span className="text-sm md:text-base font-bold bg-gradient-to-r from-purple-700 via-indigo-600 via-fuchsia-600 to-purple-700 bg-[length:200%_auto] animate-shimmer-text bg-clip-text text-transparent tracking-wide">
          Hello, {userName}
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight max-w-lg leading-snug">
        What decision are you weighing today?
      </h1>
      <p className="text-xs text-slate-600 max-w-md pt-0.5">
        I won&apos;t tell you what to do. I&apos;ll uncover what you might be missing.
      </p>
    </div>
  );
};
