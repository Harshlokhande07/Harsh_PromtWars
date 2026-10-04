"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  MoreHorizontal,
  Share2,
  Download,
  Check,
  Zap,
} from "lucide-react";

interface HeaderProps {
  onExportMarkdown: () => void;
  onOpenPrint: () => void;
  hasReport?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onExportMarkdown,
  onOpenPrint,
  hasReport,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [modelDropdown, setModelDropdown] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <header
      className="w-full flex items-center justify-between pb-4 pt-1 px-1 border-b border-slate-100/70 select-none"
      aria-label="Application Header"
    >
      {/* Left: Model Selector Pill */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setModelDropdown(!modelDropdown)}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-purple-300 text-xs font-semibold text-slate-800 shadow-xs transition-all hover:bg-purple-50/30 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px]"
          aria-haspopup="true"
          aria-expanded={modelDropdown}
          aria-label="Reasoning model selector. Current: The Blind Spot v2"
        >
          <div className="w-4 h-4 rounded-md overflow-hidden shrink-0 border border-purple-200/60 shadow-xs">
            <Image
              src="/logo.png"
              alt="The Blind Spot logo"
              width={16}
              height={16}
              className="w-full h-full object-cover"
            />
          </div>
          <span>The Blind Spot v2</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
        </button>

        {modelDropdown && (
          <div
            className="absolute left-0 mt-1.5 w-56 rounded-xl bg-white p-2 shadow-xl border border-slate-100 z-50 text-xs space-y-1"
            role="menu"
            aria-label="Reasoning Engines"
          >
            <div className="px-2.5 py-1.5 font-bold text-slate-500 text-[10px] uppercase">
              Reasoning Engine
            </div>
            <button
              type="button"
              onClick={() => setModelDropdown(false)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-purple-50 text-purple-900 font-semibold focus-visible:ring-2 focus-visible:ring-purple-500"
              role="menuitem"
            >
              <span>The Blind Spot v2 (Flash)</span>
              <Check className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setModelDropdown(false)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-50 text-slate-700 focus-visible:ring-2 focus-visible:ring-purple-500"
              role="menuitem"
            >
              <span>The Blind Spot Ultra (Deep)</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Utilities */}
      <div className="flex items-center gap-2">
        {/* Horizontal Ellipsis */}
        <button
          type="button"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="More options"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleShare}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label={copiedLink ? "Link copied to clipboard" : "Share canvas link"}
          title="Share canvas link"
        >
          {copiedLink ? (
            <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          ) : (
            <Share2 className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={hasReport ? onExportMarkdown : onOpenPrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200/80 hover:border-slate-300 text-slate-800 shadow-xs hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px]"
          aria-label="Export Decision Report"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
          <span>Export Report</span>
        </button>

        {/* Play Opposite Action Button */}
        <button
          type="button"
          onClick={onOpenPrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px]"
          aria-label="Open printable view and Play Opposite"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
          <span>Play Opposite</span>
        </button>
      </div>
    </header>
  );
};
