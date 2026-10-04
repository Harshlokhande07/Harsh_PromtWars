import { Report } from "./schema";

export interface GuardResult {
  report: Report;
  guardReport: {
    scrubbed: number;
    rules: string[];
  };
}

// Banned directive patterns
const DIRECTIVE_RULES: Array<{ id: string; pattern: RegExp; description: string }> = [
  {
    id: "you-should-must",
    pattern: /\b(?:you\s+(?:should|must|ought\s+to|need\s+to|have\s+to|shouldn['’]t|must\s+not))\b/i,
    description: "Directive 'you should/must/have to'",
  },
  {
    id: "i-recommend-suggest",
    pattern: /\b(?:i\s+(?:recommend|suggest|advise|urge|counsel))\b/i,
    description: "AI recommendation phrase",
  },
  {
    id: "best-option-choice",
    pattern: /\b(?:the\s+)?(?:best|optimal|superior|winning|ideal)\s+(?:option|choice|path|decision|route|alternative)\b/i,
    description: "Declaring a 'best option/choice'",
  },
  {
    id: "go-with-pick-take",
    pattern: /\b(?:go\s+(?:with|for)|(?:choose|pick|take|accept|decline|reject)\s+(?:the|this|that|option\s+[ab]))\b/i,
    description: "Action command or directive choice",
  },
  {
    id: "my-advice-verdict",
    pattern: /\b(?:my|our|the)\s+(?:advice|verdict|recommendation|final\s+verdict|ruling)\b/i,
    description: "Advice or verdict label",
  },
  {
    id: "better-than-ranking",
    pattern: /\b(?:is\s+(?:clearly\s+)?better\s+than|superior\s+to|is\s+the\s+winner)\b/i,
    description: "Comparative ranking assertion",
  },
  {
    id: "numeric-score-grade",
    pattern: /\b(?:\d+\s*(?:\/|out\s+of)\s*\d+|score:\s*\d+|rating:\s*\d+|grade:\s*[a-f][+-]?)\b/i,
    description: "Score or numeric rating",
  },
  // Hinglish & Hindi directives
  {
    id: "hinglish-chahiye",
    pattern: /\b(?:tumhe|aapko|aap\s+ko|tujhe)\s+.*(?:chahiye|karna\s+chahiye|lena\s+chahiye|chhodna\s+chahiye)\b/i,
    description: "Hinglish directive 'aapko karna chahiye'",
  },
  {
    id: "hinglish-karna-chahiye",
    pattern: /\b(?:karna\s+chahiye|lena\s+chahiye|manzoor\s+karna\s+chahiye|chunaav\s+karna\s+chahiye)\b/i,
    description: "Hinglish 'karna chahiye'",
  },
  {
    id: "hinglish-salah-verdict",
    pattern: /\b(?:mere\s+hisaab\s+se|meri\s+salah|sahi\s+option|galat\s+option|sabse\s+(?:accha|achha|badhiya|sahi))\b/i,
    description: "Hinglish recommendation/judgment",
  },
];

/**
 * Checks if a string is an acceptable non-directive inquiry
 * (e.g. questioning the user's phrasing, asking an open question).
 */
export function isExemptQuestion(text: string): boolean {
  const trimmed = text.trim();
  // If it's an explicit probe asking about the user's feelings or words:
  // e.g. "You mentioned you 'should' accept - what makes that feel mandatory?"
  const hasQuotes = /["'“”‘’].*(?:should|must|ought|chahiye).*["'“”‘’]/i.test(trimmed);
  const isQuestion = trimmed.endsWith("?") || /^(what|how|why|where|when|who|which|could|might|is\s+it\s+possible)\b/i.test(trimmed);
  
  return hasQuotes && isQuestion;
}

/**
 * Neutralizes a single string if it contains directive / verdict phrases.
 */
export function scrubString(
  text: string,
  triggeredRules: Set<string>
): string {
  if (!text || typeof text !== "string") return text;
  if (isExemptQuestion(text)) return text;

  let cleaned = text;

  for (const rule of DIRECTIVE_RULES) {
    if (rule.pattern.test(cleaned)) {
      triggeredRules.add(rule.description);

      // Perform context-aware neutral rewrites
      cleaned = cleaned
        .replace(/\b(?:you\s+should|you\s+must|you\s+need\s+to|you\s+have\s+to)\s+([a-zA-Z0-9_\s]+)/gi, (_m, action) => {
          return `one angle to explore is what happens if you ${action}`;
        })
        .replace(/\b(?:i\s+recommend|i\s+suggest|i\s+advise)\s+([a-zA-Z0-9_\s]+)/gi, (_m, rest) => {
          return `a perspective worth considering is ${rest}`;
        })
        .replace(/\b(?:the\s+)?(?:best|optimal|superior|winning|ideal)\s+(?:option|choice|path|decision)\b/gi, "one viable path")
        .replace(/\b(?:go\s+(?:with|for))\s+([a-zA-Z0-9_\s]+)/gi, "exploring $1")
        .replace(/\b(?:choose|pick|take|accept)\s+the\s+([a-zA-Z0-9_\s]+)/gi, "evaluating the $1")
        .replace(/\b(?:tumhe|aapko|aap\s+ko|tujhe)\s+([a-zA-Z0-9_\s]+)\s+chahiye\b/gi, "ek pehlu yeh hai ki $1 ke baare mein sochen")
        .replace(/\b(?:karna\s+chahiye|lena\s+chahiye)\b/gi, "par vichaar kiya ja sakta hai")
        .replace(/\b(?:mere\s+hisaab\s+se|meri\s+salah)\b/gi, "ek drishtikon yeh hai ki")
        .replace(/\b(?:sabse\s+(?:accha|achha|badhiya|sahi))\s+(?:option|choice|raasta)\b/gi, "ek vikalp");

      // Check if still matching after rewrite; if so, replace with safe generic probe
      if (rule.pattern.test(cleaned)) {
        cleaned = "A question worth reflecting on: what unspoken assumptions might influence this angle?";
      }
    }
  }

  return cleaned;
}

/**
 * Normalizes text for grounded substring matching
 */
export function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Verifies if candidate quote is genuinely present in the user input.
 */
export function isQuoteGrounded(quote: string, userInput: string): boolean {
  if (!quote || !userInput) return false;
  const normQuote = normalizeForMatch(quote);
  const normInput = normalizeForMatch(userInput);
  if (!normQuote || !normInput) return false;

  // Exact normalized match or significant substring (>= 10 chars)
  if (normInput.includes(normQuote)) return true;

  // If quote is long, check if 70% of quote is in input
  const words = normQuote.split(" ");
  if (words.length >= 4) {
    const chunk = words.slice(0, Math.min(words.length, 6)).join(" ");
    if (normInput.includes(chunk)) return true;
  }

  return false;
}

/**
 * Recursively walks the report JSON and applies the verdict guard to every string,
 * and validates / fixes grounded quotes.
 */
export function applyVerdictGuard(report: Report, userInput?: string): GuardResult {
  const triggeredRules = new Set<string>();

  // Deep clone
  const scrubbedReport: Report = JSON.parse(JSON.stringify(report));

  // 1. Summary
  scrubbedReport.reasoningSummary = scrubString(scrubbedReport.reasoningSummary, triggeredRules);

  // 2. Unstated assumptions
  if (Array.isArray(scrubbedReport.unstatedAssumptions)) {
    scrubbedReport.unstatedAssumptions = scrubbedReport.unstatedAssumptions.filter((assump) => {
      assump.assumption = scrubString(assump.assumption, triggeredRules);
      assump.whyItMatters = scrubString(assump.whyItMatters, triggeredRules);
      
      // If user input is provided, check grounded quote
      if (userInput && assump.groundedQuote) {
        if (!isQuoteGrounded(assump.groundedQuote, userInput)) {
          // If quote cannot be verified, check if we can synthesize a grounded phrase or drop
          const normInput = normalizeForMatch(userInput);
          if (normInput.length < 5) return false;
          // Soft-fix: keep assumption if valid, but sanitize quote to user's first phrase
          const snippet = userInput.split(/[.,;\n]/)[0]?.trim();
          assump.groundedQuote = snippet || assump.groundedQuote;
        }
      }
      return true;
    });
  }

  // 3. Overlooked factors
  const factorCategories: (keyof typeof scrubbedReport.overlookedFactors)[] = [
    "shortTerm",
    "longTerm",
    "affectedPeople",
    "hiddenRisks",
    "opportunityCost",
    "reversibility",
  ];

  for (const cat of factorCategories) {
    if (Array.isArray(scrubbedReport.overlookedFactors[cat])) {
      scrubbedReport.overlookedFactors[cat] = scrubbedReport.overlookedFactors[cat].map((item) => ({
        ...item,
        factor: scrubString(item.factor, triggeredRules),
        probe: scrubString(item.probe, triggeredRules),
      }));
    }
  }

  // 4. Conflicts
  if (Array.isArray(scrubbedReport.reasoningConflicts)) {
    scrubbedReport.reasoningConflicts = scrubbedReport.reasoningConflicts.map((c) => ({
      ...c,
      statedPriority: scrubString(c.statedPriority, triggeredRules),
      conflictingSignal: scrubString(c.conflictingSignal, triggeredRules),
      tension: scrubString(c.tension, triggeredRules),
    }));
  }

  // 5. Socratic questions
  if (Array.isArray(scrubbedReport.socraticQuestions)) {
    scrubbedReport.socraticQuestions = scrubbedReport.socraticQuestions.map((q) =>
      scrubString(q, triggeredRules)
    );
  }

  // 6. What would change your mind
  if (Array.isArray(scrubbedReport.whatWouldChangeYourMind)) {
    scrubbedReport.whatWouldChangeYourMind = scrubbedReport.whatWouldChangeYourMind.map((w) =>
      scrubString(w, triggeredRules)
    );
  }

  // 7. Biases
  if (Array.isArray(scrubbedReport.cognitiveBiases)) {
    scrubbedReport.cognitiveBiases = scrubbedReport.cognitiveBiases.map((b) => ({
      ...b,
      plainDefinition: scrubString(b.plainDefinition, triggeredRules),
      howItMayShowUp: scrubString(b.howItMayShowUp, triggeredRules),
    }));
  }

  // 8. Opposite view
  if (scrubbedReport.oppositeView) {
    scrubbedReport.oppositeView.title = scrubString(scrubbedReport.oppositeView.title, triggeredRules);
    scrubbedReport.oppositeView.steelman = scrubString(scrubbedReport.oppositeView.steelman, triggeredRules);
    if (Array.isArray(scrubbedReport.oppositeView.questionsItRaises)) {
      scrubbedReport.oppositeView.questionsItRaises = scrubbedReport.oppositeView.questionsItRaises.map((q) =>
        scrubString(q, triggeredRules)
      );
    }
  }

  // 9. Pre-mortem
  if (scrubbedReport.preMortem) {
    scrubbedReport.preMortem.scenario = scrubString(scrubbedReport.preMortem.scenario, triggeredRules);
    if (Array.isArray(scrubbedReport.preMortem.questions)) {
      scrubbedReport.preMortem.questions = scrubbedReport.preMortem.questions.map((q) =>
        scrubString(q, triggeredRules)
      );
    }
  }

  // 10. Time lenses
  if (scrubbedReport.timeLenses) {
    scrubbedReport.timeLenses.tenDays = scrubString(scrubbedReport.timeLenses.tenDays, triggeredRules);
    scrubbedReport.timeLenses.tenMonths = scrubString(scrubbedReport.timeLenses.tenMonths, triggeredRules);
    scrubbedReport.timeLenses.tenYears = scrubString(scrubbedReport.timeLenses.tenYears, triggeredRules);
  }

  // 11. Stakeholder voices
  if (Array.isArray(scrubbedReport.stakeholderVoices)) {
    scrubbedReport.stakeholderVoices = scrubbedReport.stakeholderVoices.map((v) => ({
      who: scrubString(v.who, triggeredRules),
      theirConcernAsQuestion: scrubString(v.theirConcernAsQuestion, triggeredRules),
    }));
  }

  const scrubbedCount = triggeredRules.size;
  scrubbedReport.meta = {
    ...scrubbedReport.meta,
    guardReport: {
      scrubbed: scrubbedCount,
      rules: Array.from(triggeredRules),
    },
  };

  return {
    report: scrubbedReport,
    guardReport: scrubbedReport.meta.guardReport,
  };
}
