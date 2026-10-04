import { Report } from "./schema";
import { ReflectionState } from "./coverage";

export interface HistoryItem {
  id: string;
  createdAt: number;
  input: string;
  title: string;
  language: "en" | "hinglish";
  mode: "live" | "fallback";
  report: Report;
  reflections: ReflectionState;
  confidenceBefore?: number;
  confidenceAfter?: number;
}

export interface UserSettings {
  language: "en" | "hinglish";
  enableVoice: boolean;
  theme?: "light" | "dark";
}

const STORAGE_KEYS = {
  HISTORY: "bs:history",
  REFLECTIONS_PREFIX: "bs:reflections:",
  SETTINGS: "bs:settings",
};

const MAX_HISTORY_ITEMS = 20;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveHistoryItem(item: HistoryItem): void {
  if (!isBrowser()) return;
  try {
    const existing = getHistory();
    const filtered = existing.filter((h) => h.id !== item.id);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save history to localStorage", err);
  }
}

export function getHistory(): HistoryItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read history from localStorage", err);
    return [];
  }
}

export function deleteHistoryItem(id: string): void {
  if (!isBrowser()) return;
  try {
    const existing = getHistory();
    const updated = existing.filter((h) => h.id !== id);
    window.localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    window.localStorage.removeItem(`${STORAGE_KEYS.REFLECTIONS_PREFIX}${id}`);
  } catch (err) {
    console.warn("Could not delete history item", err);
  }
}

export function clearAllHistory(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.warn("Could not clear history", err);
  }
}

export function saveReflections(sessionId: string, reflections: ReflectionState): void {
  if (!isBrowser() || !sessionId) return;
  try {
    window.localStorage.setItem(
      `${STORAGE_KEYS.REFLECTIONS_PREFIX}${sessionId}`,
      JSON.stringify(reflections)
    );
  } catch (err) {
    console.warn("Could not save reflections", err);
  }
}

export function getReflections(sessionId: string): ReflectionState {
  if (!isBrowser() || !sessionId) return {};
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEYS.REFLECTIONS_PREFIX}${sessionId}`);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("Could not read reflections", err);
    return {};
  }
}

export function getSettings(): UserSettings {
  const defaultSettings: UserSettings = {
    language: "en",
    enableVoice: true,
  };
  if (!isBrowser()) return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch (err) {
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<UserSettings>): void {
  if (!isBrowser()) return;
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save settings", err);
  }
}
