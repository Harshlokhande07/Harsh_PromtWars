import { Report } from "./schema";

export type ReflectionStatus = "hadnt_thought" | "already_considered" | "disagree";

export interface CardReflection {
  status?: ReflectionStatus;
  note?: string;
  updatedAt?: number;
}

export type ReflectionState = Record<string, CardReflection>;

export interface SectionCoverage {
  name: string;
  total: number;
  reviewed: number;
  percentage: number;
}

export interface CoverageResult {
  totalCards: number;
  reviewedCards: number;
  percentage: number;
  breakdown: {
    assumptions: SectionCoverage;
    factors: SectionCoverage;
    conflicts: SectionCoverage;
    biases: SectionCoverage;
  };
}

/**
 * Calculates reflection coverage metrics across all interactive cards in a report.
 * Pure function: measures user review thoroughness, NEVER decision quality.
 */
export function calculateCoverage(
  report: Report | null | undefined,
  reflections: ReflectionState = {}
): CoverageResult {
  if (!report) {
    return {
      totalCards: 0,
      reviewedCards: 0,
      percentage: 0,
      breakdown: {
        assumptions: { name: "Assumptions", total: 0, reviewed: 0, percentage: 0 },
        factors: { name: "Overlooked Factors", total: 0, reviewed: 0, percentage: 0 },
        conflicts: { name: "Reasoning Conflicts", total: 0, reviewed: 0, percentage: 0 },
        biases: { name: "Cognitive Biases", total: 0, reviewed: 0, percentage: 0 },
      },
    };
  }

  // 1. Assumptions
  const assumptionsTotal = report.unstatedAssumptions?.length || 0;
  const assumptionsReviewed = (report.unstatedAssumptions || []).filter(
    (a) => reflections[a.id]?.status !== undefined
  ).length;

  // 2. Factors
  let factorsTotal = 0;
  let factorsReviewed = 0;
  const factorCategories: (keyof typeof report.overlookedFactors)[] = [
    "shortTerm",
    "longTerm",
    "affectedPeople",
    "hiddenRisks",
    "opportunityCost",
    "reversibility",
  ];

  for (const cat of factorCategories) {
    const list = report.overlookedFactors?.[cat] || [];
    factorsTotal += list.length;
    for (const item of list) {
      if (reflections[item.id]?.status !== undefined) {
        factorsReviewed++;
      }
    }
  }

  // 3. Conflicts
  const conflictsTotal = report.reasoningConflicts?.length || 0;
  const conflictsReviewed = (report.reasoningConflicts || []).filter(
    (c) => reflections[c.id]?.status !== undefined
  ).length;

  // 4. Biases
  const biasesTotal = report.cognitiveBiases?.length || 0;
  const biasesReviewed = (report.cognitiveBiases || []).filter(
    (b) => reflections[b.id]?.status !== undefined
  ).length;

  const totalCards = assumptionsTotal + factorsTotal + conflictsTotal + biasesTotal;
  const reviewedCards = assumptionsReviewed + factorsReviewed + conflictsReviewed + biasesReviewed;
  const percentage = totalCards > 0 ? Math.round((reviewedCards / totalCards) * 100) : 0;

  const calcPct = (rev: number, tot: number) => (tot > 0 ? Math.round((rev / tot) * 100) : 0);

  return {
    totalCards,
    reviewedCards,
    percentage,
    breakdown: {
      assumptions: {
        name: "Unstated Assumptions",
        total: assumptionsTotal,
        reviewed: assumptionsReviewed,
        percentage: calcPct(assumptionsReviewed, assumptionsTotal),
      },
      factors: {
        name: "Overlooked Factors",
        total: factorsTotal,
        reviewed: factorsReviewed,
        percentage: calcPct(factorsReviewed, factorsTotal),
      },
      conflicts: {
        name: "Reasoning Conflicts",
        total: conflictsTotal,
        reviewed: conflictsReviewed,
        percentage: calcPct(conflictsReviewed, conflictsTotal),
      },
      biases: {
        name: "Cognitive Biases",
        total: biasesTotal,
        reviewed: biasesReviewed,
        percentage: calcPct(biasesReviewed, biasesTotal),
      },
    },
  };
}
