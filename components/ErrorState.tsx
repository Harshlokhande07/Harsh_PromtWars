"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onFallback?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onFallback }) => {
  return (
    <div className="w-full bg-white rounded-card p-6 border-2 border-red-100 shadow-card text-center space-y-4">
      <div className="w-12 h-12 bg-red-50 text-warn rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-base font-semibold text-gray-900">Something interrupted the analysis</h3>
        <p className="text-xs text-gray-600">{error || "Could not complete the thinking partner request."}</p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-btn shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
        {onFallback && (
          <button
            type="button"
            onClick={onFallback}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-btn transition-all"
          >
            <span>View Demo Fallback Report</span>
          </button>
        )}
      </div>
    </div>
  );
};
