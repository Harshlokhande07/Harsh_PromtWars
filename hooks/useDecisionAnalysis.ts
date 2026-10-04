"use client";

import { useState, useCallback } from "react";
import { Report, ClarifyResponse, SafetyCard as SafetyCardType } from "@/lib/schema";
import { INTERNSHIP_FALLBACK_REPORT } from "@/lib/fallback/internshipReport";

/**
 * Custom hook to execute and manage decision analysis requests against /api/analyze.
 */
export function useDecisionAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [clarifyData, setClarifyData] = useState<ClarifyResponse | null>(null);
  const [safetyData, setSafetyData] = useState<SafetyCardType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearAnalysisState = useCallback(() => {
    setReport(null);
    setClarifyData(null);
    setSafetyData(null);
    setErrorMessage(null);
  }, []);

  const analyzeDecision = useCallback(
    async (
      text: string,
      language: "en" | "hinglish",
      force: boolean = false,
      onReportSuccess?: (report: Report, sessionId: string) => void
    ) => {
      if (!text.trim()) return;

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
            text,
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
          setReport(data.report);
          onReportSuccess?.(data.report, sessionId);
        } else if (data.error) {
          setErrorMessage(data.error);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn("API fallback triggered:", err);
        const fallbackReport: Report = {
          ...INTERNSHIP_FALLBACK_REPORT,
          meta: {
            ...INTERNSHIP_FALLBACK_REPORT.meta,
            language,
            mode: "fallback",
            fallbackReason: "network",
          },
        };
        setReport(fallbackReport);
        const sessionId = `session_${Date.now()}`;
        onReportSuccess?.(fallbackReport, sessionId);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    report,
    setReport,
    clarifyData,
    setClarifyData,
    safetyData,
    setSafetyData,
    errorMessage,
    setErrorMessage,
    clearAnalysisState,
    analyzeDecision,
  };
}
