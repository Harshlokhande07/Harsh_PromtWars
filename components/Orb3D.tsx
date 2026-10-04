"use client";

import React from "react";

export const Orb3D: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center my-3 select-none pointer-events-none">
      {/* Outer subtle glow halo */}
      <div className="absolute w-44 h-44 rounded-full luminous-orb-halo animate-pulse" />

      {/* Main 3D luminous sphere */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full luminous-orb flex items-center justify-center">
        {/* Organic swirl highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-white/70 blur-[2px] opacity-80" />
        <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-white/75 blur-[4px]" />
      </div>
    </div>
  );
};
