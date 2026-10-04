import { GoogleGenerativeAI } from "@google/generative-ai";
import { Report, ReportSchema } from "./schema";
import { buildSystemPrompt, buildUserPrompt } from "./prompt";
import { applyVerdictGuard } from "./guard";

import { DEFAULT_LLM_TIMEOUT_MS, DEFAULT_LLM_MODEL } from "./constants";

const DEFAULT_TIMEOUT_MS = parseInt(
  process.env.LLM_TIMEOUT_MS || String(DEFAULT_LLM_TIMEOUT_MS),
  10
);
const DEFAULT_MODEL = process.env.LLM_MODEL || DEFAULT_LLM_MODEL;

/**
 * Extracts and cleans JSON from raw LLM text response.
 */
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  // Strip Markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Calls Google Gemini LLM to generate a structured blind-spot analysis.
 * Implements timeout, 1 retry, Zod validation, and the two-layer Verdict Guard.
 */
export async function generateReport(
  userInput: string,
  language: "en" | "hinglish" = "en"
): Promise<Report> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-api-key-here") {
    throw new Error("MISSING_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const systemPrompt = buildSystemPrompt(language);
  const userPrompt = buildUserPrompt(userInput);

  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  });

  const runWithTimeout = async () => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), DEFAULT_TIMEOUT_MS)
    );

    const callPromise = (async () => {
      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      return response.text();
    })();

    return Promise.race([callPromise, timeoutPromise]);
  };

  let rawJsonText: string;
  try {
    rawJsonText = await runWithTimeout();
  } catch (firstError) {
    // Retry once on failure
    console.warn("LLM first attempt failed, retrying once...", firstError);
    rawJsonText = await runWithTimeout();
  }

  const cleanedJson = cleanJsonOutput(rawJsonText);
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(cleanedJson);
  } catch (err) {
    throw new Error(`INVALID_JSON: ${(err as Error).message}`);
  }

  // Ensure meta block exists before Zod validation
  const candidateReport = {
    ...(parsedJson as Record<string, unknown>),
    meta: {
      mode: "live" as const,
      language,
      guardReport: { scrubbed: 0, rules: [] },
    },
  };

  // Validate against Zod schema
  const validatedReport = ReportSchema.parse(candidateReport);

  // Apply Verdict Guard and Grounding verification
  const guarded = applyVerdictGuard(validatedReport, userInput);

  return guarded.report;
}
