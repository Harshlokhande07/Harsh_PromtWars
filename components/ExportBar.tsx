"use client";

import React, { useState } from "react";
import { Copy, Check, Printer } from "lucide-react";
import { Report } from "@/lib/schema";
import { ReflectionState } from "@/lib/coverage";
import { generateMarkdownReport } from "@/lib/markdown";

interface ExportBarProps {
  userInput: string;
  report: Report;
  reflections: ReflectionState;
  confidenceBefore?: number;
  confidenceAfter?: number;
}

export const ExportBar: React.FC<ExportBarProps> = ({
  userInput,
  report,
  reflections,
  confidenceBefore,
  confidenceAfter,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      const md = generateMarkdownReport(
        userInput,
        report,
        reflections,
        confidenceBefore,
        confidenceAfter
      );
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Could not copy markdown to clipboard", err);
    }
  };

  const handleOpenPrint = () => {
    // Store current state in localStorage for /print page to render
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          "bs:print_session",
          JSON.stringify({
            userInput,
            report,
            reflections,
            confidenceBefore,
            confidenceAfter,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.warn("Error caching print session", err);
      }
      window.open("/print", "_blank");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Copy Markdown */}
      <button
        type="button"
        onClick={handleCopyMarkdown}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
        title="Copy complete analysis with reflections and notes to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Copied MD!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>Copy Markdown</span>
          </>
        )}
      </button>

      {/* Clean Print / PDF */}
      <button
        type="button"
        onClick={handleOpenPrint}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all"
        title="Open clean printable view for PDF export"
      >
        <Printer className="w-3.5 h-3.5 text-gray-500" />
        <span>Print / PDF</span>
      </button>
    </div>
  );
};
