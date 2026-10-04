"use client";

import React, { useState, useEffect, useRef } from "react";
import { Languages, RotateCcw, ArrowLeft, Sparkles } from "lucide-react";
import { HistoryItem, getSettings, saveSettings } from "@/lib/storage";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ChatInput } from "@/components/ChatInput";
import { StarterCards } from "@/components/StarterCards";
import { ClarifyStep } from "@/components/ClarifyStep";
import { SafetyCard } from "@/components/SafetyCard";
import { Skeletons } from "@/components/Skeletons";
import { ErrorState } from "@/components/ErrorState";
import { ReportView } from "@/components/ReportView";
import { INTERNSHIP_FALLBACK_REPORT, SAMPLE_INTERNSHIP_INPUT } from "@/lib/fallback/internshipReport";
import { generateMarkdownReport } from "@/lib/markdown";
import { DEFAULT_CONFIDENCE_RATING } from "@/lib/constants";
import { useReflections } from "@/hooks/useReflections";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useDecisionAnalysis } from "@/hooks/useDecisionAnalysis";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "hinglish">("en");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [confidenceBefore, setConfidenceBefore] = useState<number>(DEFAULT_CONFIDENCE_RATING);
  const [confidenceAfter, setConfidenceAfter] = useState<number>(DEFAULT_CONFIDENCE_RATING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mainScrollRef = useRef<HTMLElement>(null);
  const reportSectionRef = useRef<HTMLDivElement>(null);

  // Extracted custom hooks for clean modularity
  const {
    reflections,
    setReflections,
    handleReflectionChange,
    loadSessionReflections,
    resetReflections,
  } = useReflections(currentSessionId);

  const { historyList, addHistoryItem } = useSessionHistory();

  const {
    isLoading,
    report,
    setReport,
    clarifyData,
    safetyData,
    setSafetyData,
    errorMessage,
    clearAnalysisState,
    analyzeDecision,
  } = useDecisionAnalysis();

  // Load initial settings and configure mobile drawer
  useEffect(() => {
    try {
      const settings = getSettings();
      setLanguage(settings.language || "en");

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.warn("Error initializing settings", err);
    }
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = language === "en" ? "hinglish" : "en";
    setLanguage(nextLang);
    saveSettings({ language: nextLang });
  };

  const handleNewDecision = () => {
    setInput("");
    clearAnalysisState();
    resetReflections();
    setCurrentSessionId("");
  };

  const handleExecuteAnalyze = async (customText?: string, force: boolean = false) => {
    const textToAnalyze = customText || input;
    if (!textToAnalyze.trim()) return;

    await analyzeDecision(
      textToAnalyze,
      language,
      force,
      (newReport, sessionId) => {
        setCurrentSessionId(sessionId);
        loadSessionReflections(sessionId);

        const newHistoryItem: HistoryItem = {
          id: sessionId,
          createdAt: Date.now(),
          input: textToAnalyze,
          title: textToAnalyze.slice(0, 60),
          language,
          mode: newReport.meta?.mode || "live",
          report: newReport,
          reflections: {},
          confidenceBefore,
          confidenceAfter,
        };
        addHistoryItem(newHistoryItem);

        // Smooth scroll to report view
        setTimeout(() => {
          if (reportSectionRef.current) {
            reportSectionRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    );
  };

  const handleSelectHistorySession = (item: HistoryItem) => {
    setCurrentSessionId(item.id);
    setInput(item.input);
    setReport(item.report);
    setReflections(item.reflections || {});
    setConfidenceBefore(item.confidenceBefore ?? DEFAULT_CONFIDENCE_RATING);
    setConfidenceAfter(item.confidenceAfter ?? DEFAULT_CONFIDENCE_RATING);
    setLanguage(item.language || "en");

    setTimeout(() => {
      if (reportSectionRef.current) {
        reportSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleExportMarkdown = async () => {
    if (!report) return;
    try {
      const md = generateMarkdownReport(
        input || SAMPLE_INTERNSHIP_INPUT,
        report,
        reflections,
        confidenceBefore,
        confidenceAfter
      );
      await navigator.clipboard.writeText(md);
      alert("Analysis and reflection notes copied to clipboard in Markdown!");
    } catch (err) {
      console.warn("Copy error", err);
    }
  };

  const handleOpenPrint = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          "bs:print_session",
          JSON.stringify({
            userInput: input || SAMPLE_INTERNSHIP_INPUT,
            report: report || INTERNSHIP_FALLBACK_REPORT,
            reflections,
            confidenceBefore,
            confidenceAfter,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.warn("Print session cache error", err);
      }
      window.open("/print", "_blank");
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Central Floating Card Container */}
      <div className="w-full max-w-6xl mx-auto rounded-3xl sm:rounded-[32px] glass-canvas overflow-hidden min-h-[90vh] flex flex-col md:flex-row shadow-2xl transition-all">
        {/* Left Collapsible Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewDecision={handleNewDecision}
          historyList={historyList}
          onSelectHistory={handleSelectHistorySession}
          userName="Harsh"
          userEmail="harsh@blindspot.ai"
        />

        {/* Right Main Content Panel */}
        <main
          id="main-content"
          ref={mainScrollRef}
          tabIndex={-1}
          className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-h-[92vh] overflow-x-hidden focus:outline-none"
        >
          <div className="space-y-6 w-full">
            {/* Top Bar Header */}
            <Header
              onExportMarkdown={handleExportMarkdown}
              onOpenPrint={handleOpenPrint}
              hasReport={Boolean(report)}
            />

            {/* Back button when report is active */}
            {report && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleNewDecision}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none min-h-[36px]"
                  aria-label="Start new decision session"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-purple-600" aria-hidden="true" />
                  <span>Start New Decision</span>
                </button>

                <div
                  className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded-full border border-purple-100"
                  aria-live="polite"
                >
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Viewing Socratic Analysis</span>
                </div>
              </div>
            )}

            {/* Central Hero Graphic & Greeting */}
            {!report && !isLoading && (
              <Hero userName="Harsh" hasReport={Boolean(report)} />
            )}

            {/* Prominent Floating Input Box */}
            <section className="w-full" aria-label="Decision Input Form">
              <ChatInput
                input={input}
                onInputChange={setInput}
                onSubmit={() => handleExecuteAnalyze()}
                isLoading={isLoading}
                onSelectSavedPrompt={(promptText) => {
                  setInput(promptText);
                  handleExecuteAnalyze(promptText);
                }}
              />
            </section>

            {/* Clarify Step (Shows immediately below input when triggered) */}
            {clarifyData && (
              <div
                className="max-w-2xl mx-auto w-full animate-in fade-in duration-300"
                aria-live="polite"
              >
                <ClarifyStep
                  clarifyData={clarifyData}
                  originalText={input}
                  onContinueWithAnswers={(enriched) => {
                    setInput(enriched);
                    handleExecuteAnalyze(enriched, true);
                  }}
                  onForceContinue={() => handleExecuteAnalyze(input, true)}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Safety Card (Shows immediately below input when triggered) */}
            {safetyData && (
              <div
                className="max-w-2xl mx-auto w-full animate-in fade-in duration-300"
                aria-live="assertive"
              >
                <SafetyCard safetyData={safetyData} onReset={() => setSafetyData(null)} />
              </div>
            )}

            {/* 5 Quick Starter Cards (shown on empty canvas) */}
            {!report && !isLoading && !clarifyData && !safetyData && (
              <StarterCards
                onSelectStarter={(starterText) => {
                  setInput(starterText);
                  handleExecuteAnalyze(starterText);
                }}
                disabled={isLoading}
              />
            )}

            {/* Skeletons Loading */}
            {isLoading && (
              <div
                className="max-w-3xl mx-auto w-full pt-4"
                aria-live="polite"
                aria-label="Analyzing decision..."
              >
                <Skeletons />
              </div>
            )}

            {/* Error State */}
            {errorMessage && (
              <div className="max-w-2xl mx-auto w-full" aria-live="assertive">
                <ErrorState
                  error={errorMessage}
                  onRetry={() => handleExecuteAnalyze()}
                  onFallback={() => setReport(INTERNSHIP_FALLBACK_REPORT)}
                />
              </div>
            )}

            {/* Structured Report View */}
            {report && !isLoading && (
              <div
                ref={reportSectionRef}
                className="w-full max-w-4xl mx-auto pt-2 space-y-4"
                aria-live="polite"
              >
                <ReportView
                  report={report}
                  userInput={input}
                  reflections={reflections}
                  onReflectionChange={handleReflectionChange}
                  confidenceBefore={confidenceBefore}
                  confidenceAfter={confidenceAfter}
                  onConfidenceBeforeChange={setConfidenceBefore}
                  onConfidenceAfterChange={setConfidenceAfter}
                  onReAnalyzeWithNewInfo={(updatedText) => {
                    setInput(updatedText);
                    handleExecuteAnalyze(updatedText, true);
                  }}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          {/* Footer Bar Landmark */}
          <footer className="w-full pt-8 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 select-none border-t border-slate-100/60 mt-6">
            <div className="flex items-center gap-1.5 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <span>Join the community:</span>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-2 min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
              >
                Join Discord
              </a>
              <span className="hidden md:inline">• This tool helps you think. The decision is yours.</span>
            </div>

            {/* Bottom Right Floating Widgets (min 44px tap targets) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLanguageToggle}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200/60 shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
                aria-label={`Switch Language (Current: ${language === "en" ? "English" : "Hinglish"})`}
                title={`Switch Language (Current: ${language === "en" ? "English" : "Hinglish"})`}
              >
                <Languages className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNewDecision}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200/60 shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
                aria-label="Reset Decision Canvas"
                title="Reset Decision Canvas"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
