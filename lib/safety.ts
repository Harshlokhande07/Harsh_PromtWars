import { SafetyCard } from "./schema";

interface SafetyPattern {
  category: "self_harm" | "medical" | "legal" | "abuse";
  patterns: RegExp[];
  message: string;
}

const FALSE_POSITIVE_PATTERNS: RegExp[] = [
  /\bkilling\s+it\b/i,
  /\bkilling\s+time\b/i,
  /\bdying\s+to\s+(?:know|try|see|learn|get|work|do|build)\b/i,
  /\bdead\s+tired\b/i,
  /\bdeadlines?\s+(?:are|is)\s+killing\b/i,
  /\bshooting\s+for\b/i,
  /\btake\s+a\s+shot\b/i,
  /\bbite\s+the\s+bullet\b/i,
  /\bdie\s+hard\b/i,
  /\bto\s+die\s+for\b/i,
  /\bfeeling\s+dead\s+inside\s+about\s+work\b/i,
];

const SAFETY_RULES: SafetyPattern[] = [
  {
    category: "self_harm",
    patterns: [
      /\bsuicide\b/i,
      /\b(?:want|plan|planning|going|wish)\s+to\s+(?:die|kill\s+myself|end\s+my\s+life)\b/i,
      /\b(?:kill|end|harm)\s+(?:myself|my\s+life|it\s+all)\b/i,
      /\b(?:better\s+off\s+dead|no\s+reason\s+to\s+live|don['’]t\s+want\s+to\s+live)\b/i,
      /\b(?:self[- ]harm|cut(?:ting)?\s+my\s+wrists?|overdose\s+on\s+pills)\b/i,
      // Hindi / Hinglish patterns
      /\b(?:aatmahatya|khudkushi|jaan\s+dena)\b/i,
      /\b(?:mar\s+jaana\s+chahta\s+hoon|mar\s+jana\s+chahta\s+hu|marne\s+ka\s+man)\b/i,
      /\b(?:jeena\s+nahi\s+chahta|jeene\s+ka\s+koi\s+fayda\s+nahi|khatam\s+karna\s+chahta)\b/i,
    ],
    message:
      "It sounds like you may be going through a deeply distressing moment. Your life and well-being come first. Please reach out to compassionate professionals who are available right now.",
  },
  {
    category: "medical",
    patterns: [
      /\b(?:crushing\s+chest\s+pain|difficulty\s+breathing|suspected\s+stroke|severe\s+allergic\s+anaphylaxis)\b/i,
      /\b(?:having\s+a\s+heart\s+attack|swallowed\s+poison|severe\s+uncontrolled\s+bleeding)\b/i,
      /\b(?:dil\s+ka\s+daura|saans\s+nahi\s+aa\s+rahi|zeher\s+kha\s+liya)\b/i,
    ],
    message:
      "This looks like an urgent medical emergency. Please contact emergency medical services immediately.",
  },
  {
    category: "abuse",
    patterns: [
      /\b(?:being\s+beaten\s+at\s+home|domestic\s+violence|physical\s+abuse|afraid\s+(?:he|she|they)\s+will\s+kill\s+me)\b/i,
      /\b(?:locked\s+in\s+a\s+room\s+against\s+will|sexual\s+assault|threatened\s+with\s+weapon)\b/i,
      /\b(?:maar\s+peet|gharelu\s+hinsa|dhamki\s+de\s+rahe\s+hain)\b/i,
    ],
    message:
      "If you are facing domestic abuse or immediate danger, please prioritize your physical safety and reach out to dedicated support services.",
  },
  {
    category: "legal",
    patterns: [
      /\b(?:police\s+are\s+raiding|actively\s+being\s+arrested|kidnapped\s+and\s+held)\b/i,
      /\b(?:extortion\s+threat\s+with\s+immediate\s+violence)\b/i,
    ],
    message:
      "This appears to involve an immediate legal or extortion emergency. Please contact official authorities directly.",
  },
];

export const STANDARD_HELPLINES = [
  {
    name: "Tele-MANAS (24/7 Mental Health Helpline - India)",
    contact: "14416 / 1800-891-4416",
    tel: "tel:14416",
    description: "Free, confidential 24/7 mental health counseling across India in multiple regional languages.",
    url: "https://telemanas.mohfw.gov.in/",
  },
  {
    name: "iCall Psychosocial Helpline (India)",
    contact: "+91 9152987821",
    tel: "tel:+919152987821",
    description: "Free counseling support by TISS (Monday to Saturday, 10 AM to 8 PM).",
    url: "https://icallhelpline.org/",
  },
  {
    name: "National Emergency Services",
    contact: "112",
    tel: "tel:112",
    description: "All-in-one national emergency response number for police, ambulance, and disaster assistance.",
  },
  {
    name: "Find A Helpline (International)",
    contact: "Online Directory",
    description: "Free, confidential crisis support from verified local hotlines in over 130 countries worldwide.",
    url: "https://findahelpline.com/",
  },
];

/**
 * Checks if user text contains high-urgency distress / emergency patterns.
 */
export function checkSafety(userInput: string): SafetyCard | null {
  if (!userInput || typeof userInput !== "string") return null;

  const trimmed = userInput.trim();
  if (trimmed.length === 0) return null;

  // Check if text is only a known benign idiom
  for (const fp of FALSE_POSITIVE_PATTERNS) {
    if (fp.test(trimmed)) {
      const stripped = trimmed.replace(fp, "").trim();
      if (!/suicide|kill\s+myself|end\s+my\s+life|die|aatmahatya|khudkushi|mar\s+jaana/i.test(stripped)) {
        return null;
      }
    }
  }

  for (const rule of SAFETY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(trimmed)) {
        return {
          isSafetyTrigger: true,
          category: rule.category,
          message: rule.message,
          helplines: STANDARD_HELPLINES,
        };
      }
    }
  }

  return null;
}
