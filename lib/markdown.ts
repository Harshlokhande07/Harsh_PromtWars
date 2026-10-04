import { Report } from "./schema";
import { ReflectionState, calculateCoverage } from "./coverage";

function formatStatusTag(status?: string): string {
  if (status === "hadnt_thought") return "🔍 *[Marked: Hadn't thought of this]*";
  if (status === "already_considered") return "✅ *[Marked: Already considered]*";
  if (status === "disagree") return "❌ *[Marked: Disagree]*";
  return "";
}

export function generateMarkdownReport(
  userInput: string,
  report: Report,
  reflections: ReflectionState = {},
  confidenceBefore?: number,
  confidenceAfter?: number
): string {
  const coverage = calculateCoverage(report, reflections);
  const now = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const lines: string[] = [];

  lines.push("# The Blind Spot — Thinking Partner Report");
  lines.push(`*Generated on ${now} • Review Coverage: ${coverage.reviewedCards}/${coverage.totalCards} cards (${coverage.percentage}%)*`);
  lines.push("");
  lines.push("> **Neutrality Note**: This document is an exploratory thinking mirror designed to surface unstated assumptions, trade-offs, and questions. It contains **no verdicts, scores, rankings, or advice**.");
  lines.push("");

  // Confidence check
  if (confidenceBefore !== undefined || confidenceAfter !== undefined) {
    lines.push("## Your Confidence Check");
    if (confidenceBefore !== undefined) {
      lines.push(`- **Starting Confidence:** ${confidenceBefore}/10`);
    }
    if (confidenceAfter !== undefined) {
      lines.push(`- **Post-Reflection Confidence:** ${confidenceAfter}/10`);
    }
    lines.push("*(Self-reported ratings, never evaluated or scored by AI)*");
    lines.push("");
  }

  // Original input
  lines.push("## Original Decision Context");
  lines.push("```");
  lines.push(userInput.trim());
  lines.push("```");
  lines.push("");

  // 1. Reasoning summary
  lines.push("## 1. Your Reasoning (As Understood)");
  lines.push(report.reasoningSummary);
  lines.push("");

  // 2. Unstated Assumptions
  lines.push("## 2. Unstated Assumptions");
  report.unstatedAssumptions.forEach((a, idx) => {
    const ref = reflections[a.id];
    lines.push(`### Assumption ${idx + 1}: ${a.assumption}`);
    lines.push(`> **Grounded in your words:** "${a.groundedQuote}"`);
    lines.push("");
    lines.push(`**Why it matters:** ${a.whyItMatters}`);
    if (ref?.status) {
      lines.push("");
      lines.push(formatStatusTag(ref.status));
    }
    if (ref?.note?.trim()) {
      lines.push(`> 📝 **My Reflection Note:** ${ref.note.trim()}`);
    }
    lines.push("");
  });

  // 3. Overlooked Factors
  lines.push("## 3. Overlooked Factors");
  const categories: Array<{ key: keyof typeof report.overlookedFactors; label: string }> = [
    { key: "shortTerm", label: "Short-Term Dynamics" },
    { key: "longTerm", label: "Long-Term Trajectory" },
    { key: "affectedPeople", label: "Affected People" },
    { key: "hiddenRisks", label: "Hidden Risks & Fragility" },
    { key: "opportunityCost", label: "Opportunity Cost" },
    { key: "reversibility", label: "Reversibility (One-way vs Two-way door)" },
  ];

  for (const cat of categories) {
    const items = report.overlookedFactors[cat.key] || [];
    if (items.length > 0) {
      lines.push(`### ${cat.label}`);
      items.forEach((item) => {
        const ref = reflections[item.id];
        lines.push(`- **${item.factor}**`);
        lines.push(`  *Probe question:* ${item.probe}`);
        if (ref?.status) {
          lines.push(`  ${formatStatusTag(ref.status)}`);
        }
        if (ref?.note?.trim()) {
          lines.push(`  > 📝 *Note:* ${ref.note.trim()}`);
        }
      });
      lines.push("");
    }
  }

  // 4. Reasoning Conflicts
  lines.push("## 4. Reasoning Conflicts & Tensions");
  report.reasoningConflicts.forEach((c, idx) => {
    const ref = reflections[c.id];
    lines.push(`### Tension ${idx + 1}`);
    lines.push(`- **Stated Priority:** ${c.statedPriority}`);
    lines.push(`- **Conflicting Signal:** ${c.conflictingSignal}`);
    lines.push(`- **The Tension:** ${c.tension}`);
    if (ref?.status) {
      lines.push(formatStatusTag(ref.status));
    }
    if (ref?.note?.trim()) {
      lines.push(`> 📝 *Note:* ${ref.note.trim()}`);
    }
    lines.push("");
  });

  // 5. Socratic Questions
  lines.push("## 5. Socratic Questions to Sit With");
  report.socraticQuestions.forEach((q, idx) => {
    lines.push(`${idx + 1}. ${q}`);
  });
  lines.push("");

  // 6. What Would Change Your Mind
  lines.push("## 6. What Would Change Your Mind?");
  report.whatWouldChangeYourMind.forEach((w) => {
    lines.push(`- ${w}`);
  });
  lines.push("");

  // 7. Cognitive Biases
  if (report.cognitiveBiases && report.cognitiveBiases.length > 0) {
    lines.push("## 7. Possible Cognitive Biases");
    report.cognitiveBiases.forEach((b) => {
      const ref = reflections[b.id];
      lines.push(`### ${b.name}`);
      lines.push(`*${b.plainDefinition}*`);
      lines.push("");
      lines.push(`> **From your input:** "${b.groundedQuote}"`);
      lines.push("");
      lines.push(`**How it may show up:** ${b.howItMayShowUp}`);
      if (ref?.status) {
        lines.push(formatStatusTag(ref.status));
      }
      if (ref?.note?.trim()) {
        lines.push(`> 📝 *Note:* ${ref.note.trim()}`);
      }
      lines.push("");
    });
  }

  // 8. Play the Opposite
  if (report.oppositeView) {
    lines.push("## 8. Play the Opposite (Steelman Perspective)");
    lines.push(`### ${report.oppositeView.title}`);
    lines.push(report.oppositeView.steelman);
    lines.push("");
    lines.push("**Questions this raises:**");
    report.oppositeView.questionsItRaises.forEach((q) => {
      lines.push(`- ${q}`);
    });
    lines.push("");
  }

  // 9. Pre-mortem & Time Lenses
  if (report.preMortem || report.timeLenses || report.stakeholderVoices?.length) {
    lines.push("## 9. Perspectives & Time Lenses");

    if (report.timeLenses) {
      lines.push("### Time Lenses");
      lines.push(`- **In 10 Days:** ${report.timeLenses.tenDays}`);
      lines.push(`- **In 10 Months:** ${report.timeLenses.tenMonths}`);
      lines.push(`- **In 10 Years:** ${report.timeLenses.tenYears}`);
      lines.push("");
    }

    if (report.preMortem) {
      lines.push(`### Pre-Mortem Scenario: ${report.preMortem.scenario}`);
      report.preMortem.questions.forEach((q) => {
        lines.push(`- ${q}`);
      });
      lines.push("");
    }

    if (report.stakeholderVoices && report.stakeholderVoices.length > 0) {
      lines.push("### Stakeholder Voices");
      report.stakeholderVoices.forEach((sv) => {
        lines.push(`- **${sv.who}:** "${sv.theirConcernAsQuestion}"`);
      });
      lines.push("");
    }
  }

  // Guard Transparency
  if (report.meta?.guardReport) {
    lines.push("---");
    lines.push(`*Neutrality Guard verified: ${report.meta.guardReport.scrubbed} directive expressions neutralized. Mode: ${report.meta.mode}.*`);
  }

  return lines.join("\n");
}
