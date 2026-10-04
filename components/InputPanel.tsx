"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Mic, MicOff, RotateCcw, ArrowRight } from "lucide-react";
import { ExampleStarters } from "./ExampleStarters";

interface InputPanelProps {
  input: string;
  onInputChange: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onSelectStarter: (text: string) => void;
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

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onInputChange,
  onAnalyze,
  isLoading,
  onSelectStarter,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  useEffect(() => {
    // Check Web Speech API support
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => WebSpeechRecognition;
      webkitSpeechRecognition?: new () => WebSpeechRecognition;
    };

    const SpeechRecognitionConstructor =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      setIsVoiceSupported(true);
      const recognition = new SpeechRecognitionConstructor();
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

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

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
        console.warn("Speech recognition start failed", err);
      }
    }
  };

  const handleClear = () => {
    onInputChange("");
  };

  const charCount = input.length;
  const isTooLong = charCount > 4000;
  const isReady = input.trim().length > 0 && !isTooLong && !isLoading;

  return (
    <div className="w-full bg-white rounded-card p-5 md:p-7 shadow-card border border-gray-200/80 space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="decision-input"
            className="text-xs font-bold uppercase tracking-wider text-gray-700"
          >
            What decision are you wrestling with?
          </label>
          <div className="flex items-center gap-3">
            {input.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
            <span
              className={`text-xs font-medium ${
                isTooLong ? "text-rose-600 font-bold" : "text-gray-400"
              }`}
            >
              {charCount} / 4000
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="decision-input"
            rows={4}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your decision, your options, and why you're leaning the way you are... (e.g. 'I have two offers...', 'Thinking of quitting to start...', 'Should we take a loan...')"
            className="w-full text-sm sm:text-base p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent bg-gray-50/40 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 resize-y min-h-[120px]"
          />

          {/* Voice Input Button */}
          {isVoiceSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              disabled={isLoading}
              title={isListening ? "Stop voice recording" : "Dictate via microphone"}
              className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* 1-Click Starters */}
      <ExampleStarters onSelect={onSelectStarter} disabled={isLoading} />

      {/* Action Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center sm:text-left">
          🔒 Private & Confidential • No decision verdicts or unsolicited advice
        </p>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!isReady}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>Surface Blind Spots</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
