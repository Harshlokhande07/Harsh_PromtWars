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
        <div
          className="inline-flex rounded-lg p-0.5 bg-gray-100/90 border border-gray-200"
          role="group"
          aria-label="Reflection options"
        >
          {/* Hadn't thought of this */}
          <button
            type="button"
            aria-pressed={currentStatus === "hadnt_thought"}
            onClick={() => handleStatusClick("hadnt_thought")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] ${
              currentStatus === "hadnt_thought"
                ? "bg-amber-600 text-white shadow-xs font-semibold"
                : "text-gray-700 hover:text-amber-800 hover:bg-white/60"
            }`}
            aria-label="Mark: Hadn't thought of this"
          >
            <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hadn&apos;t thought of this</span>
          </button>

          {/* Already considered */}
          <button
            type="button"
            aria-pressed={currentStatus === "already_considered"}
            onClick={() => handleStatusClick("already_considered")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] ${
              currentStatus === "already_considered"
                ? "bg-emerald-700 text-white shadow-xs font-semibold"
                : "text-gray-700 hover:text-emerald-800 hover:bg-white/60"
            }`}
            aria-label="Mark: Already considered"
          >
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Already considered</span>
          </button>

          {/* Disagree */}
          <button
            type="button"
            aria-pressed={currentStatus === "disagree"}
            onClick={() => handleStatusClick("disagree")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] ${
              currentStatus === "disagree"
                ? "bg-rose-700 text-white shadow-xs font-semibold"
                : "text-gray-700 hover:text-rose-800 hover:bg-white/60"
            }`}
            aria-label="Mark: Disagree"
          >
            <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Disagree</span>
          </button>
        </div>

        {/* Note Toggle */}
        <button
          type="button"
          onClick={() => setIsEditingNote(!isEditingNote)}
          className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-purple-700 font-medium transition-colors py-1 px-2 rounded focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px]"
          aria-expanded={isEditingNote}
          aria-label={currentNote ? "Edit reflection note" : "Add personal reflection note"}
        >
          {currentNote ? (
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
          ) : (
            <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{currentNote ? "Edit Note" : "Add note"}</span>
        </button>
      </div>

      {/* Note Area */}
      {isEditingNote && (
        <div className="animate-in fade-in duration-200">
          <label htmlFor={`note-input-${cardId}`} className="sr-only">
            Personal reflection note
          </label>
          <textarea
            id={`note-input-${cardId}`}
            rows={2}
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Your personal note or reaction to this point..."
            className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder:text-gray-500"
            aria-label="Your personal note or reaction to this point"
          />
        </div>
      )}
    </div>
  );
};
