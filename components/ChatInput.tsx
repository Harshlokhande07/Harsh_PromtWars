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
  BookmarkPlus,
  Compass,
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-4 space-y-3">
        {/* Multi-line Textarea */}
        <textarea
          rows={3}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Describe your decision, your options, and why you are leaning a certain way..."
          className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none leading-relaxed"
        />

        {/* Action Toolbar Inside Box */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Deeper Research Pill & Idea Bulb */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDeepResearchMode(!deepResearchMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                deepResearchMode
                  ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-xs"
                  : "bg-slate-100/70 text-slate-500 border border-slate-200/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Deeper Research</span>
            </button>

            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50/50 rounded-lg transition-colors"
              title="Socratic inquiry tips"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Settings, Voice, and Circular Gradient Submit Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              title="Analysis parameters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {isVoiceSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                disabled={isLoading}
                className={`p-1.5 rounded-lg transition-all ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                title={isListening ? "Stop listening" : "Dictate decision"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Circular Gradient Submit Button */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 text-white flex items-center justify-center shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none transition-all"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Lower Bar: Saved prompts link & Attach file */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => setShowSavedPrompts(!showSavedPrompts)}
          className="inline-flex items-center gap-1.5 font-medium hover:text-purple-700 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>+ Saved prompts</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 font-medium hover:text-slate-800 transition-colors"
        >
          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
          <span>Attach file</span>
        </button>
      </div>

      {/* Expandable Saved Prompts Panel */}
      {showSavedPrompts && (
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-slate-200/80 shadow-md space-y-2 text-xs animate-in fade-in duration-200">
          <span className="font-bold text-slate-400 text-[10px] uppercase">
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
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-50/70 hover:bg-purple-50 text-slate-700 hover:text-purple-900 transition-colors block"
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
