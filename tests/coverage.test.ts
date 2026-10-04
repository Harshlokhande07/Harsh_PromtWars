import { describe, it, expect } from "vitest";
import { calculateCoverage, ReflectionState } from "../lib/coverage";
import { INTERNSHIP_FALLBACK_REPORT } from "../lib/fallback/internshipReport";

describe("Coverage Computation Tests", () => {
  it("calculates 0% coverage when no cards are reflected", () => {
    const coverage = calculateCoverage(INTERNSHIP_FALLBACK_REPORT, {});
    expect(coverage.percentage).toBe(0);
    expect(coverage.reviewedCards).toBe(0);
    expect(coverage.totalCards).toBeGreaterThan(0);
  });

  it("calculates correct percentage as cards are marked", () => {
    const reflections: ReflectionState = {
      "assump-1": { status: "hadnt_thought" },
      "assump-2": { status: "already_considered" },
      "st-1": { status: "disagree" },
    };

    const coverage = calculateCoverage(INTERNSHIP_FALLBACK_REPORT, reflections);
    expect(coverage.reviewedCards).toBe(3);
    const expectedPct = Math.round((3 / coverage.totalCards) * 100);
    expect(coverage.percentage).toBe(expectedPct);
    expect(coverage.breakdown.assumptions.reviewed).toBe(2);
    expect(coverage.breakdown.factors.reviewed).toBe(1);
  });

  it("handles null or undefined reports safely", () => {
    const coverage = calculateCoverage(null, {});
    expect(coverage.totalCards).toBe(0);
    expect(coverage.percentage).toBe(0);
  });
});
