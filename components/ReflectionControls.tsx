"use client";

import React, { useState } from "react";
import { Lightbulb, CheckCircle2, XCircle, MessageSquarePlus, MessageSquare } from "lucide-react";
import { ReflectionStatus, CardReflection } from "@/lib/coverage";

interface ReflectionControlsProps {
  cardId: string;
  reflection?: CardReflection;
  onChange: (cardId: string, status?: ReflectionStatus, note?: string) => void;
}

export const ReflectionControls: React.FC<ReflectionControlsProps> = ({
  cardId,
  reflection,
  onChange,
}) => {
  const currentStatus = reflection?.status;
  const currentNote = reflection?.note || "";

  const [isEditingNote, setIsEditingNote] = useState(Boolean(currentNote));
  const [noteText, setNoteText] = useState(currentNote);

  const handleStatusClick = (status: ReflectionStatus) => {
    // If clicking same status, toggle off
    const nextStatus = currentStatus === status ? undefined : status;
    onChange(cardId, nextStatus, noteText);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteText(val);
    onChange(cardId, currentStatus, val);
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Segmented Control */}
        <div className="inline-flex rounded-lg p-0.5 bg-gray-100/80 border border-gray-200/60" role="group" aria-label="Reflection options">
          {/* Hadn't thought of this */}
          <button
            type="button"
            aria-pressed={currentStatus === "hadnt_thought"}
            onClick={() => handleStatusClick("hadnt_thought")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentStatus === "hadnt_thought"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-600 hover:text-amber-700 hover:bg-white/60"
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hadn&apos;t thought of this</span>
          </button>

          {/* Already considered */}
          <button
            type="button"
            aria-pressed={currentStatus === "already_considered"}
            onClick={() => handleStatusClick("already_considered")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentStatus === "already_considered"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-gray-600 hover:text-emerald-700 hover:bg-white/60"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Already considered</span>
          </button>

          {/* Disagree */}
          <button
            type="button"
            aria-pressed={currentStatus === "disagree"}
            onClick={() => handleStatusClick("disagree")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              currentStatus === "disagree"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-gray-600 hover:text-rose-700 hover:bg-white/60"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Disagree</span>
          </button>
        </div>

        {/* Note Toggle */}
        <button
          type="button"
          onClick={() => setIsEditingNote(!isEditingNote)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors py-1 px-1.5 rounded"
          title="Add a personal thought or observation"
        >
          {currentNote ? (
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
          ) : (
            <MessageSquarePlus className="w-3.5 h-3.5" />
          )}
          <span>{currentNote ? "Edit Note" : "Add note"}</span>
        </button>
      </div>

      {/* Note Area */}
      {isEditingNote && (
        <div className="animate-in fade-in duration-200">
          <textarea
            rows={2}
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Your personal note or reaction to this point..."
            className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 placeholder-gray-400"
          />
        </div>
      )}
    </div>
  );
};
