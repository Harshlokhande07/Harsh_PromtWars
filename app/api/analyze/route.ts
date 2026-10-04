import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema, FallbackReason } from "@/lib/schema";
import { checkSafety } from "@/lib/safety";
import { checkClarify } from "@/lib/clarify";
import { generateReport } from "@/lib/llm";
import { classifyFallbackReason } from "@/lib/errors";
import { INTERNSHIP_FALLBACK_REPORT } from "@/lib/fallback/internshipReport";

export async function POST(req: NextRequest) {
  try {
    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON format in request body.",
        },
        { status: 400 }
      );
    }

    const parseResult = AnalyzeRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload. Please ensure input text is between 1 and 4000 characters.",
        },
        { status: 400 }
      );
    }

    const { text, language, force } = parseResult.data;

    // Check for forced demo query parameter or flag
    const url = new URL(req.url);
    const isForcedDemo = url.searchParams.get("demo") === "1";

    if (isForcedDemo) {
      console.log("[Analyze] Forced demo mode triggered via ?demo=1");
      return NextResponse.json({
        success: true,
        report: {
          ...INTERNSHIP_FALLBACK_REPORT,
          meta: {
            ...INTERNSHIP_FALLBACK_REPORT.meta,
            language: language || "en",
            mode: "fallback" as const,
            fallbackReason: "forced_demo" as FallbackReason,
          },
        },
      });
    }

    // 1. Safety Guard Gate (Runs FIRST before clarify & LLM)
    const safetyResult = checkSafety(text);
    if (safetyResult) {
      return NextResponse.json(
        {
          success: false,
          safety: safetyResult,
        },
        { status: 200 }
      );
    }

    // 2. Clarify Gate (Runs SECOND before LLM)
    const clarifyResult = checkClarify(text, force);
    if (clarifyResult) {
      return NextResponse.json(
        {
          success: false,
          clarify: clarifyResult,
        },
        { status: 200 }
      );
    }

    // 3. LLM Generation with Timeout & 2-Layer Verdict Guard
    try {
      const report = await generateReport(text, language);
      return NextResponse.json({
        success: true,
        report,
      });
    } catch (llmError) {
      const fallbackReason: FallbackReason = classifyFallbackReason(llmError);

      // Safe server-side logging without leaking key or user text
      console.log(`[Analyze] Fallback served: reason=${fallbackReason}`);

      const fallbackWithMeta = {
        ...INTERNSHIP_FALLBACK_REPORT,
        meta: {
          ...INTERNSHIP_FALLBACK_REPORT.meta,
          language: language || "en",
          mode: "fallback" as const,
          fallbackReason,
        },
      };

      return NextResponse.json({
        success: true,
        report: fallbackWithMeta,
      });
    }
  } catch {
    console.log("[Analyze] Unexpected server exception, served fallback (reason=model_error)");
    return NextResponse.json({
      success: true,
      report: {
        ...INTERNSHIP_FALLBACK_REPORT,
        meta: {
          ...INTERNSHIP_FALLBACK_REPORT.meta,
          mode: "fallback" as const,
          fallbackReason: "model_error" as FallbackReason,
        },
      },
    });
  }
}
