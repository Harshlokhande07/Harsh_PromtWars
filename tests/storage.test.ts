import { describe, it, expect, beforeEach } from "vitest";
import {
  getHistory,
  saveHistoryItem,
  getReflections,
  saveReflections,
  HistoryItem,
} from "@/lib/storage";
import { INTERNSHIP_FALLBACK_REPORT } from "@/lib/fallback/internshipReport";

describe("Storage Resilience & Corrupt State Handling", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    // Provide browser-like window.localStorage mock for testing
    (global as any).window = {
      localStorage: mockLocalStorage,
    };
  });

  it("handles corrupt / malformed JSON in localStorage gracefully without throwing", () => {
    (global as any).window.localStorage.setItem("bs:history", "CORRUPTED_JSON_NOT_VALID{[[");
    const history = getHistory();
    expect(history).toEqual([]);

    (global as any).window.localStorage.setItem("bs:reflections:test_session", "{malformed_data:");
    const reflections = getReflections("test_session");
    expect(reflections).toEqual({});
  });

  it("saves and retrieves session history items correctly", () => {
    const item: HistoryItem = {
      id: "session_123",
      createdAt: Date.now(),
      input: "Should I accept the startup offer?",
      title: "Startup vs Big Tech",
      language: "en",
      mode: "live",
      report: INTERNSHIP_FALLBACK_REPORT,
      reflections: {},
      confidenceBefore: 6,
      confidenceAfter: 8,
    };

    saveHistoryItem(item);
    const history = getHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe("session_123");
    expect(history[0].title).toBe("Startup vs Big Tech");
  });

  it("caps maximum history items to 20 without exceeding limit", () => {
    for (let i = 0; i < 25; i++) {
      saveHistoryItem({
        id: `session_${i}`,
        createdAt: Date.now() + i,
        input: `Decision prompt number ${i}`,
        title: `Decision ${i}`,
        language: "en",
        mode: "live",
        report: INTERNSHIP_FALLBACK_REPORT,
        reflections: {},
      });
    }

    const history = getHistory();
    expect(history.length).toBeLessThanOrEqual(20);
    expect(history[0].id).toBe("session_24"); // Most recent item appears first
  });

  it("saves, loads, and updates reflection statuses per session", () => {
    const reflections = {
      "assump-1": { status: "hadnt_thought" as const, note: "Interesting point", updatedAt: 100 },
      "assump-2": { status: "already_considered" as const, updatedAt: 200 },
    };

    saveReflections("session_abc", reflections);
    const loaded = getReflections("session_abc");
    expect(loaded["assump-1"].status).toBe("hadnt_thought");
    expect(loaded["assump-1"].note).toBe("Interesting point");
    expect(loaded["assump-2"].status).toBe("already_considered");
  });
});
