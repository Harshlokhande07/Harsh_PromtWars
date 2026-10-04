import { FallbackReason } from "./schema";

/**
 * Maps arbitrary runtime errors or API exceptions to a typed FallbackReason.
 * Ensures the system never exposes internal stack traces to the client.
 *
 * @param error - The error thrown during processing
 * @returns Standardized FallbackReason identifier
 */
export function classifyFallbackReason(error: unknown): FallbackReason {
  const errMessage = error instanceof Error ? error.message : String(error || "");

  if (errMessage.includes("MISSING_API_KEY")) {
    return "no_key";
  }
  if (
    errMessage.includes("401") ||
    errMessage.includes("API key not valid") ||
    errMessage.includes("auth")
  ) {
    return "auth_error";
  }
  if (
    errMessage.includes("429") ||
    errMessage.includes("quota") ||
    errMessage.includes("RESOURCE_EXHAUSTED")
  ) {
    return "rate_limited";
  }
  if (errMessage.includes("TIMEOUT") || errMessage.includes("timed out")) {
    return "timeout";
  }
  if (errMessage.includes("INVALID_JSON") || errMessage.includes("JSON")) {
    return "bad_json";
  }
  if (errMessage.includes("ZodError") || errMessage.includes("schema")) {
    return "schema_invalid";
  }
  if (errMessage.includes("guard")) {
    return "guard_failed";
  }
  if (
    errMessage.includes("fetch") ||
    errMessage.includes("network") ||
    errMessage.includes("ENOTFOUND")
  ) {
    return "network";
  }

  return "model_error";
}
