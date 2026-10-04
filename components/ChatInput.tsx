"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ArrowUp,
  Paperclip,
  Lightbulb,
  SlidersHorizontal,
  Mic,
  MicOff,
} from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onSelectSavedPrompt?: (prompt: string) => void;
}

interface WebSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { resultIndex: number; results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  onSelectSavedPrompt,
}) => {
  const [deepResearchMode, setDeepResearchMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [showSavedPrompts, setShowSavedPrompts] = useState(false);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  useEffect(() => {
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => WebSpeechRecognition;
      webkitSpeechRecognition?: new () => WebSpeechRecognition;
    };
    const SpeechConstructor =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechConstructor) {
      setIsVoiceSupported(true);
      const recognition = new SpeechConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onInputChange(`${input ? input + " " : ""}${transcript.trim()}`);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [input, onInputChange]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition error", err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  const savedPrompts = [
    "I have two internship offers: Google (legacy tech, 80k) vs AI startup (40k, core agent systems).",
    "Should I quit my senior finance job ($140k) to start an AI edtech platform with 6 months savings?",
    "We are taking a $450k 30-year home mortgage (45% take-home pay) vs investing in index funds.",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {/* Floating Main Input Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-4 space-y-3">
        {/* Accessible label for form control */}
        <label htmlFor="decision-input" className="sr-only">
          Describe your decision dilemma
        </label>

        {/* Multi-line Textarea */}
        <textarea
          id="decision-input"
          rows={3}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Describe your decision, your options, and why you are leaning a certain way..."
          className="w-full text-sm text-slate-900 placeholder:text-slate-500 bg-transparent resize-none focus:outline-none leading-relaxed"
          aria-label="Describe your decision dilemma"
        />

        {/* Action Toolbar Inside Box */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Deeper Research Pill & Idea Bulb */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDeepResearchMode(!deepResearchMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] ${
                deepResearchMode
                  ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-xs"
                  : "bg-slate-100/70 text-slate-600 border border-slate-200/60"
              }`}
              aria-pressed={deepResearchMode}
              aria-label="Toggle Deeper Research mode"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
              <span>Deeper Research</span>
            </button>

            <button
              type="button"
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Socratic inquiry tips"
              title="Socratic inquiry tips"
            >
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Right: Settings, Voice, and Circular Gradient Submit Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Analysis parameters"
              title="Analysis parameters"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            </button>

            {isVoiceSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
                title={isListening ? "Stop listening" : "Dictate decision"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Mic className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            )}

            {/* Circular Gradient Submit Button */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 text-white flex items-center justify-center shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none transition-all focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              aria-label="Analyze decision and surface blind spots"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Lower Bar: Saved prompts link & Attach file */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-600">
        <button
          type="button"
          onClick={() => setShowSavedPrompts(!showSavedPrompts)}
          className="inline-flex items-center gap-1.5 font-medium hover:text-purple-700 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 rounded p-1"
          aria-expanded={showSavedPrompts}
          aria-label="Toggle Quick Decision Templates"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
          <span>+ Saved prompts</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 font-medium hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 rounded p-1"
          aria-label="Attach reference document or notes"
        >
          <Paperclip className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>Attach file</span>
        </button>
      </div>

      {/* Expandable Saved Prompts Panel */}
      {showSavedPrompts && (
        <div
          className="bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/80 shadow-md space-y-2 text-xs animate-in fade-in duration-200"
          role="region"
          aria-label="Quick Decision Templates"
        >
          <span className="font-bold text-slate-500 text-[10px] uppercase">
            Quick Decision Templates
          </span>
          <div className="space-y-1.5">
            {savedPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onInputChange(p);
                  setShowSavedPrompts(false);
                  onSelectSavedPrompt?.(p);
                }}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-900 transition-colors block focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
