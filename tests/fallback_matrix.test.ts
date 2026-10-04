import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../app/api/analyze/route";
import { NextRequest } from "next/server";
import { ReportSchema } from "../lib/schema";
import * as llmModule from "../lib/llm";

function createRequest(body: Record<string, unknown>, url = "http://localhost:3000/api/analyze"): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Fallback Matrix Tests (Zero 5xx Guarantee)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const validPayload = {
    text: "I have two job offers: Offer A is at Google with $150k but legacy code. Offer B is at an AI startup with $100k.",
    language: "en" as const,
  };

  it("handles missing API key -> HTTP 200, fallbackReason: 'no_key'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("MISSING_API_KEY"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("no_key");
    expect(ReportSchema.safeParse(data.report).success).toBe(true);
  });

  it("handles 401 auth error -> HTTP 200, fallbackReason: 'auth_error'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("API key not valid. 401 Unauthorized"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("auth_error");
  });

  it("handles 429 rate limited -> HTTP 200, fallbackReason: 'rate_limited'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("429 RESOURCE_EXHAUSTED quota exceeded"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("rate_limited");
  });

  it("handles timeout -> HTTP 200, fallbackReason: 'timeout'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("LLM_TIMEOUT: request timed out"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("timeout");
  });

  it("handles malformed JSON -> HTTP 200, fallbackReason: 'bad_json'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("INVALID_JSON: Unexpected token in JSON"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("bad_json");
  });

  it("handles Zod-invalid schema shape -> HTTP 200, fallbackReason: 'schema_invalid'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("ZodError: missing required field unstatedAssumptions"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("schema_invalid");
  });

  it("handles network connection error -> HTTP 200, fallbackReason: 'network'", async () => {
    vi.spyOn(llmModule, "generateReport").mockRejectedValue(new Error("fetch failed: ENOTFOUND generativelanguage.googleapis.com"));

    const req = createRequest(validPayload);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("network");
  });

  it("handles forced demo mode via ?demo=1 URL parameter -> HTTP 200, fallbackReason: 'forced_demo'", async () => {
    const req = createRequest(validPayload, "http://localhost:3000/api/analyze?demo=1");
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.report.meta.mode).toBe("fallback");
    expect(data.report.meta.fallbackReason).toBe("forced_demo");
  });
});
