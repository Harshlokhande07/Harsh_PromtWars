import { describe, it, expect } from "vitest";
import { AnalyzeRequestSchema } from "@/lib/schema";
import { classifyFallbackReason } from "@/lib/errors";
import { MAX_INPUT_CHARS } from "@/lib/constants";

describe("API Request Validation & Error Categorization", () => {
  it("rejects empty body / empty string with Zod validation failure", () => {
    const resEmpty = AnalyzeRequestSchema.safeParse({});
    expect(resEmpty.success).toBe(false);

    const resEmptyStr = AnalyzeRequestSchema.safeParse({ text: "" });
    expect(resEmptyStr.success).toBe(false);
  });

  it("rejects oversized input exceeding MAX_INPUT_CHARS (4000 chars)", () => {
    const oversizedText = "a".repeat(MAX_INPUT_CHARS + 1);
    const result = AnalyzeRequestSchema.safeParse({ text: oversizedText });
    expect(result.success).toBe(false);
  });

  it("accepts valid input within 1 to 4000 characters", () => {
    const validText = "I am deciding between joining a startup or staying in my corporate role.";
    const result = AnalyzeRequestSchema.safeParse({ text: validText, language: "en" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe(validText);
      expect(result.data.language).toBe("en");
    }
  });

  it("categorizes all error types reliably through classifyFallbackReason", () => {
    expect(classifyFallbackReason(new Error("MISSING_API_KEY"))).toBe("no_key");
    expect(classifyFallbackReason(new Error("401 Unauthorized API key not valid"))).toBe("auth_error");
    expect(classifyFallbackReason(new Error("429 RESOURCE_EXHAUSTED quota exceeded"))).toBe("rate_limited");
    expect(classifyFallbackReason(new Error("LLM_TIMEOUT timed out"))).toBe("timeout");
    expect(classifyFallbackReason(new Error("INVALID_JSON parse error"))).toBe("bad_json");
    expect(classifyFallbackReason(new Error("ZodError: schema shape mismatch"))).toBe("schema_invalid");
    expect(classifyFallbackReason(new Error("Directive guard triggered"))).toBe("guard_failed");
    expect(classifyFallbackReason(new Error("fetch failed ENOTFOUND"))).toBe("network");
    expect(classifyFallbackReason(new Error("unknown exception"))).toBe("model_error");
  });
});
