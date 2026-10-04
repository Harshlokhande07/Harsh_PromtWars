"use client";

import React, { useState } from "react";

export const Orb3D: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate normalized tilt (-10px to +10px)
    const deltaX = ((e.clientX - centerX) / (rect.width / 2)) * 12;
    const deltaY = ((e.clientY - centerY) / (rect.height / 2)) * 12;
    setTilt({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative flex items-center justify-center my-3 select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="3D Luminous Decision Orb"
    >
      {/* Outer subtle breathing glow halo */}
      <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full luminous-orb-halo pointer-events-none transition-transform duration-700 group-hover:scale-110" />

      {/* Ambient soft purple flare behind sphere */}
      <div className="absolute w-36 h-36 rounded-full bg-purple-400/25 blur-xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-70" />

      {/* Main 3D luminous animated sphere */}
      <div
        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full luminous-orb flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: isHovered
            ? `translate3d(${tilt.x}px, ${tilt.y - 6}px, 0) scale(1.06)`
            : undefined,
        }}
      >
        {/* Iridescent internal swirl */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-white/35 to-white/75 blur-[2px] opacity-85 pointer-events-none" />

        {/* Specular animated glint */}
        <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-white/85 blur-[3px] luminous-glint pointer-events-none" />

        {/* Secondary soft rim light */}
        <div className="absolute bottom-3 right-5 w-6 h-6 rounded-full bg-indigo-300/40 blur-[4px] pointer-events-none" />
      </div>
    </div>
  );
};
