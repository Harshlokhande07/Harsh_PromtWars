"use client";

import React from "react";
import { HeartHandshake, Phone, ExternalLink } from "lucide-react";
import { SafetyCard as SafetyCardType } from "@/lib/schema";

interface SafetyCardProps {
  safetyData: SafetyCardType;
  onReset?: () => void;
}

export const SafetyCard: React.FC<SafetyCardProps> = ({ safetyData, onReset }) => {
  return (
    <div className="w-full bg-rose-50/80 border-2 border-rose-200 rounded-card p-6 md:p-8 shadow-card text-gray-900 animate-in fade-in duration-300">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0 mt-0.5">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-bold text-gray-950">
            Your safety and well-being come first
          </h2>
          <p className="text-sm md:text-base text-gray-750 leading-relaxed">
            {safetyData.message}
          </p>

          <div className="mt-6 pt-4 border-t border-rose-200">
            <h3 className="text-xs font-semibold text-rose-900 uppercase tracking-wider mb-3">
              Confidential & Immediate Crisis Support
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {safetyData.helplines.map((helpline, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 p-4 rounded-xl border border-rose-100 shadow-xs space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">{helpline.name}</span>
                      {helpline.url && (
                        <a
                          href={helpline.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 hover:text-rose-800 p-1"
                          title="Open Resource"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 leading-normal">{helpline.description}</p>
                  </div>

                  {helpline.tel ? (
                    <a
                      href={helpline.tel}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors w-fit"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{helpline.contact}</span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg w-fit">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{helpline.contact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {onReset && (
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={onReset}
                className="text-xs font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
              >
                Return to main canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
