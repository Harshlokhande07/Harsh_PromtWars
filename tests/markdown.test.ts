import { describe, it, expect } from "vitest";
import { generateMarkdownReport } from "../lib/markdown";
import { INTERNSHIP_FALLBACK_REPORT, SAMPLE_INTERNSHIP_INPUT } from "../lib/fallback/internshipReport";

describe("Markdown Export Tests", () => {
  it("generates structured markdown including reflections and user notes", () => {
    const reflections = {
      "assump-1": {
        status: "hadnt_thought" as const,
        note: "I should check if Google allows 20% project time",
      },
    };

    const md = generateMarkdownReport(
      SAMPLE_INTERNSHIP_INPUT,
      INTERNSHIP_FALLBACK_REPORT,
      reflections,
      6,
      8
    );

    expect(md).toContain("# The Blind Spot — Thinking Partner Report");
    expect(md).toContain("## 1. Your Reasoning (As Understood)");
    expect(md).toContain("## 2. Unstated Assumptions");
    expect(md).toContain("Hadn't thought of this");
    expect(md).toContain("I should check if Google allows 20% project time");
    expect(md).toContain("**Starting Confidence:** 6/10");
    expect(md).toContain("**Post-Reflection Confidence:** 8/10");
  });
});
