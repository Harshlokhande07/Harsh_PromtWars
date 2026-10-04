import { describe, it, expect } from "vitest";
import { checkSafety } from "@/lib/safety";
import { checkClarify } from "@/lib/clarify";
import { INTERNSHIP_FALLBACK_REPORT } from "@/lib/fallback/internshipReport";
import { generateMarkdownReport } from "@/lib/markdown";

describe("Accessibility & Safety Compliance Smoke Tests", () => {
  it("provides valid contact information for all emergency crisis helplines", () => {
    const safety = checkSafety("I want to end my life");
    expect(safety).not.toBeNull();
    expect(safety?.isSafetyTrigger).toBe(true);
    expect(safety?.helplines.length).toBeGreaterThanOrEqual(4);

    safety?.helplines.forEach((helpline) => {
      expect(helpline.name.length).toBeGreaterThan(0);
      expect(helpline.contact.length).toBeGreaterThan(0);
      expect(helpline.description.length).toBeGreaterThan(0);
    });

    const hasTeleManas = safety?.helplines.some((h) => h.contact.includes("14416"));
    const hasICall = safety?.helplines.some((h) => h.contact.includes("9152987821"));
    const hasEmergency = safety?.helplines.some((h) => h.contact.includes("112"));
    expect(hasTeleManas).toBe(true);
    expect(hasICall).toBe(true);
    expect(hasEmergency).toBe(true);
  });

  it("ensures clarify questions provide clear Socratic direction without leading or deciding", () => {
    const clarify = checkClarify("Should I quit?");
    expect(clarify).not.toBeNull();
    expect(clarify?.needsClarify).toBe(true);
    expect(clarify?.questions.length).toBe(3);

    clarify?.questions.forEach((q) => {
      expect(q).toMatch(/\?$/);
      // Questions must not contain directives or verdicts
      expect(q).not.toMatch(/\b(you should|you must|i recommend)\b/i);
    });
  });

  it("ensures markdown report export escapes markdown fences and preserves semantic headings", () => {
    const userInputWithBackticks = "Contemplating offer ```with code``` and quotes";
    const md = generateMarkdownReport(
      userInputWithBackticks,
      INTERNSHIP_FALLBACK_REPORT,
      {},
      6,
      8
    );

    expect(md).toContain("# The Blind Spot — Thinking Partner Report");
    expect(md).toContain("## 1. Your Reasoning (As Understood)");
    expect(md).toContain("## 2. Unstated Assumptions");
    expect(md).toContain("## 3. Overlooked Factors");
    // Escaped backticks
    expect(md).toContain("\\`\\`\\`");
    // Starts with single H1
    const h1Count = (md.match(/^# /gm) || []).length;
    expect(h1Count).toBe(1);
  });
});
