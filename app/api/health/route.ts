import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const keyPresent = Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== "your_gemini_api_key_here");
  const model = process.env.LLM_MODEL || "gemini-1.5-flash";

  return NextResponse.json({
    ok: true,
    keyPresent,
    model,
  });
}
