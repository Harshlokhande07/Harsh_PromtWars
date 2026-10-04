import { describe, it, expect } from "vitest";
import { checkClarify, countMeaningfulWords } from "../lib/clarify";
import { SAMPLE_INTERNSHIP_INPUT } from "../lib/fallback/internshipReport";

describe("Clarify Gate Tests", () => {
  it("triggers clarify step for sparse or vague inputs", () => {
    const vagueInputs = [
      "Should I quit?",
      "Job offer A or B",
      "Need advice on career",
      "Can't decide",
      "Startup or corporate?",
    ];

    for (const input of vagueInputs) {
      const result = checkClarify(input);
      expect(result).not.toBeNull();
      expect(result?.needsClarify).toBe(true);
      expect(result?.questions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("passes comprehensive decision descriptions without triggering clarify", () => {
    const result = checkClarify(SAMPLE_INTERNSHIP_INPUT);
    expect(result).toBeNull();
  });

  it("allows forcing through even short inputs when force=true", () => {
    const result = checkClarify("Should I quit?", true);
    expect(result).toBeNull();
  });

  it("counts meaningful content words accurately", () => {
    expect(countMeaningfulWords("Should I quit?")).toBe(2); // should, quit
    expect(countMeaningfulWords("I have two internship offers at Google and startup")).toBe(5);
  });
});
