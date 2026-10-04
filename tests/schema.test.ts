import { describe, it, expect } from "vitest";
import { ReportSchema, FORBIDDEN_KEYS } from "../lib/schema";
import { INTERNSHIP_FALLBACK_REPORT } from "../lib/fallback/internshipReport";

describe("Schema Validation Tests", () => {
  it("validates the fallback internship report successfully", () => {
    const parsed = ReportSchema.safeParse(INTERNSHIP_FALLBACK_REPORT);
    expect(parsed.success).toBe(true);
  });

  it("strictly forbids verdict and score keys in schema", () => {
    for (const key of FORBIDDEN_KEYS) {
      const invalidReport = {
        ...INTERNSHIP_FALLBACK_REPORT,
        [key]: "This should fail",
      };
      const parsed = ReportSchema.safeParse(invalidReport);
      expect(parsed.success).toBe(false);
    }
  });

  it("rejects incomplete reports missing required sections", () => {
    const incomplete = {
      reasoningSummary: "Only a summary",
    };
    const parsed = ReportSchema.safeParse(incomplete);
    expect(parsed.success).toBe(false);
  });
});
