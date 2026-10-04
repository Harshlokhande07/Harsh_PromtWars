import { ClarifyResponse } from "./schema";

/**
 * Stopwords to filter when counting meaningful content words.
 */
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "so", "to", "of", "in", "for",
  "on", "at", "by", "with", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "i", "me", "my", "you", "your",
  "he", "she", "it", "we", "they", "this", "that", "these", "those"
]);

/**
 * Counts meaningful (non-stopword, length > 2) words.
 */
export function countMeaningfulWords(text: string): number {
  if (!text) return 0;
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return words.length;
}

/**
 * Checks whether user input is too sparse or vague to produce rich grounded blind spots.
 */
export function checkClarify(text: string, force: boolean = false): ClarifyResponse | null {
  if (force) return null;
  if (!text || typeof text !== "string") {
    return {
      needsClarify: true,
      questions: [
        "What specific decision are you trying to make?",
        "What are the concrete options or alternatives you are weighing?",
        "What is currently making this decision difficult for you?",
      ],
      reason: "No input provided.",
    };
  }

  const trimmed = text.trim();
  const meaningfulCount = countMeaningfulWords(trimmed);
  const totalWords = trimmed.split(/\s+/).filter(Boolean).length;

  // Very short inputs (e.g. "Should I quit?", "Need help with job", "A vs B")
  if (totalWords < 12 || meaningfulCount < 8) {
    const isQuestion = trimmed.endsWith("?") || /^(should|can|will|must|do|what|how)\b/i.test(trimmed);

    const questions: string[] = [];
    if (isQuestion) {
      questions.push("What are the main options or paths you are considering?");
      questions.push("What is leaning you toward one option versus the other right now?");
      questions.push("What is the biggest risk or uncertainty you feel about this?");
    } else {
      questions.push("What is the specific dilemma or fork in the road you are facing?");
      questions.push("What are the specific trade-offs (e.g., money, learning, stability, time) involved?");
      questions.push("What would an ideal outcome look like in 6 months?");
    }

    return {
      needsClarify: true,
      questions,
      reason: "Your decision description is brief. Adding a few details about your options and priorities helps surface deeper, grounded blind spots.",
    };
  }

  return null;
}
