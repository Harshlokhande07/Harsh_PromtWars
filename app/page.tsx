"use client";

import React, { useState, useEffect, useRef } from "react";
import { Languages, RotateCcw, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Report, ClarifyResponse, SafetyCard as SafetyCardType } from "@/lib/schema";
import { ReflectionState, ReflectionStatus } from "@/lib/coverage";
import {
  HistoryItem,
  getHistory,
  saveHistoryItem,
  getReflections,
  saveReflections,
  getSettings,
  saveSettings,
} from "@/lib/storage";
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

export default function HomePage() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "hinglish">("en");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [report, setReport] = useState<Report | null>(null);
  const [reflections, setReflections] = useState<ReflectionState>({});
  const [confidenceBefore, setConfidenceBefore] = useState<number>(5);
  const [confidenceAfter, setConfidenceAfter] = useState<number>(5);

  const [isLoading, setIsLoading] = useState(false);
  const [clarifyData, setClarifyData] = useState<ClarifyResponse | null>(null);
  const [safetyData, setSafetyData] = useState<SafetyCardType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mainScrollRef = useRef<HTMLElement>(null);
  const reportSectionRef = useRef<HTMLDivElement>(null);

  // Load initial settings and history
  useEffect(() => {
    try {
      const settings = getSettings();
      setLanguage(settings.language || "en");
      setHistoryList(getHistory());

      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.warn("Error initializing settings", err);
    }
  }, []);

  const handleReflectionChange = (
    cardId: string,
    status?: ReflectionStatus,
    note?: string
  ) => {
    setReflections((prev) => {
      const updated = {
        ...prev,
        [cardId]: { status, note, updatedAt: Date.now() },
      };
      if (currentSessionId) {
        saveReflections(currentSessionId, updated);
      }
      return updated;
    });
  };

  const handleLanguageToggle = () => {
    const nextLang = language === "en" ? "hinglish" : "en";
    setLanguage(nextLang);
    saveSettings({ language: nextLang });
  };

  const handleNewDecision = () => {
    setInput("");
    setReport(null);
    setClarifyData(null);
    setSafetyData(null);
    setErrorMessage(null);
    setReflections({});
    setCurrentSessionId("");
  };

  const handleAnalyze = async (customText?: string, force: boolean = false) => {
    const textToAnalyze = customText || input;
    if (!textToAnalyze.trim()) return;

    setIsLoading(true);
    setClarifyData(null);
    setSafetyData(null);
    setErrorMessage(null);

    const isDemoForced =
      typeof window !== "undefined" && window.location.search.includes("demo=1");

    const endpoint = isDemoForced ? "/api/analyze?demo=1" : "/api/analyze";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToAnalyze,
          language,
          force,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.safety) {
        setSafetyData(data.safety);
        setReport(null);
      } else if (data.clarify) {
        setClarifyData(data.clarify);
      } else if (data.report) {
        const sessionId = `session_${Date.now()}`;
        setCurrentSessionId(sessionId);
        setReport(data.report);

        const loadedReflections = getReflections(sessionId);
        setReflections(loadedReflections);

        const newHistoryItem: HistoryItem = {
          id: sessionId,
          createdAt: Date.now(),
          input: textToAnalyze,
          title: textToAnalyze.slice(0, 60),
          language,
          mode: data.report.meta?.mode || "live",
          report: data.report,
          reflections: loadedReflections,
          confidenceBefore,
          confidenceAfter,
        };
        saveHistoryItem(newHistoryItem);
        setHistoryList(getHistory());

        // Scroll to report smoothly
        setTimeout(() => {
          if (reportSectionRef.current) {
            reportSectionRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("API fallback triggered:", err);
      setReport({
        ...INTERNSHIP_FALLBACK_REPORT,
        meta: {
          ...INTERNSHIP_FALLBACK_REPORT.meta,
          language,
          mode: "fallback",
          fallbackReason: "network",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistorySession = (item: HistoryItem) => {
    setCurrentSessionId(item.id);
    setInput(item.input);
    setReport(item.report);
    setReflections(item.reflections || {});
    setConfidenceBefore(item.confidenceBefore ?? 5);
    setConfidenceAfter(item.confidenceAfter ?? 5);
    setLanguage(item.language || "en");
    setClarifyData(null);
    setSafetyData(null);
    setErrorMessage(null);

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
      {/* Central Floating Card Container */}
      <div className="w-full max-w-6xl mx-auto rounded-3xl sm:rounded-[32px] glass-canvas overflow-hidden min-h-[90vh] flex flex-col md:flex-row shadow-2xl transition-all">
        {/* Left Collapsible Sidebar */}
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
          ref={mainScrollRef}
          className="flex-1 flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-h-[92vh] overflow-x-hidden"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-purple-600" />
                  <span>Start New Decision</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Viewing Socratic Analysis</span>
                </div>
              </div>
            )}

            {/* Central Hero Graphic & Greeting */}
            {!report && !isLoading && (
              <Hero userName="Harsh" hasReport={Boolean(report)} />
            )}

            {/* Prominent Floating Input Box */}
            <section className="w-full">
              <ChatInput
                input={input}
                onInputChange={setInput}
                onSubmit={() => handleAnalyze()}
                isLoading={isLoading}
                onSelectSavedPrompt={(promptText) => {
                  setInput(promptText);
                  handleAnalyze(promptText);
                }}
              />
            </section>

            {/* Clarify Step (Shows immediately below input when triggered) */}
            {clarifyData && (
              <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-300">
                <ClarifyStep
                  clarifyData={clarifyData}
                  originalText={input}
                  onContinueWithAnswers={(enriched) => {
                    setInput(enriched);
                    handleAnalyze(enriched, true);
                  }}
                  onForceContinue={() => handleAnalyze(input, true)}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Safety Card (Shows immediately below input when triggered) */}
            {safetyData && (
              <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-300">
                <SafetyCard safetyData={safetyData} onReset={() => setSafetyData(null)} />
              </div>
            )}

            {/* 3 Quick Starter Cards (shown on empty canvas) */}
            {!report && !isLoading && !clarifyData && !safetyData && (
              <StarterCards
                onSelectStarter={(starterText) => {
                  setInput(starterText);
                  handleAnalyze(starterText);
                }}
                disabled={isLoading}
              />
            )}

            {/* Skeletons Loading */}
            {isLoading && (
              <div className="max-w-3xl mx-auto w-full pt-4">
                <Skeletons />
              </div>
            )}

            {/* Error State */}
            {errorMessage && (
              <div className="max-w-2xl mx-auto w-full">
                <ErrorState
                  error={errorMessage}
                  onRetry={() => handleAnalyze()}
                  onFallback={() => setReport(INTERNSHIP_FALLBACK_REPORT)}
                />
              </div>
            )}

            {/* Structured Report View */}
            {report && !isLoading && (
              <div ref={reportSectionRef} className="w-full max-w-4xl mx-auto pt-2 space-y-4">
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
                    handleAnalyze(updatedText, true);
                  }}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <footer className="w-full pt-8 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 select-none border-t border-slate-100/60 mt-6">
            <div className="flex items-center gap-1.5 text-center sm:text-left flex-wrap justify-center sm:justify-start">
              <span>Join the community:</span>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-semibold underline underline-offset-2 min-h-[44px] inline-flex items-center"
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
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-slate-500 hover:text-purple-700 border border-slate-200/60 shadow-xs transition-colors"
                title={`Switch Language (Current: ${language === "en" ? "English" : "Hinglish"})`}
              >
                <Languages className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNewDecision}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white hover:bg-purple-50 text-slate-500 hover:text-purple-700 border border-slate-200/60 shadow-xs transition-colors"
                title="Reset Decision Canvas"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
