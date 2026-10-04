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
    <div className="flex flex-col items-center justify-center text-center pt-2 pb-6 space-y-2 select-none animate-in fade-in duration-500">
      {/* 3D Luminous Orb Graphic */}
      <Orb3D />

      {/* Greeting */}
      <span className="text-sm md:text-base font-semibold text-[#A894C8] tracking-wide">
        Hello, {userName}
      </span>

      {/* Main Headline */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800 tracking-tight max-w-lg leading-snug">
        What decision are you weighing today?
      </h1>
      <p className="text-xs text-slate-400 max-w-md pt-0.5">
        I won&apos;t tell you what to do. I&apos;ll uncover what you might be missing.
      </p>
    </div>
  );
};
