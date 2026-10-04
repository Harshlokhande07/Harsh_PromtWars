/**
 * Application Constants
 * Single source of truth for numerical thresholds, timeouts, and system boundaries.
 */

/** Maximum allowed character count for user decision text */
export const MAX_INPUT_CHARS = 4000;

/** Minimum word count before the clarify gate triggers */
export const CLARIFY_WORD_THRESHOLD = 15;

/** Default timeout in milliseconds for upstream Gemini LLM calls */
export const DEFAULT_LLM_TIMEOUT_MS = 25000;

/** Default model fallback name if environment variable is not set */
export const DEFAULT_LLM_MODEL = "gemini-1.5-flash";

/** Maximum number of stored sessions in browser localStorage */
export const MAX_STORED_SESSIONS = 20;

/** Standard application brand name */
export const APP_NAME = "The Blind Spot";

/** Default confidence rating on the 1-10 Likert scale */
export const DEFAULT_CONFIDENCE_RATING = 5;
