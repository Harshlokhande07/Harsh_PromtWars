"use client";

import { useState, useCallback } from "react";
import { ReflectionState, ReflectionStatus } from "@/lib/coverage";
import { getReflections, saveReflections } from "@/lib/storage";

/**
 * Custom hook to manage decision reflection tags and qualitative notes.
 * Automatically persists updates to localStorage under the active sessionId.
 *
 * @param currentSessionId - Active decision session identifier
 */
export function useReflections(currentSessionId: string) {
  const [reflections, setReflections] = useState<ReflectionState>({});

  const handleReflectionChange = useCallback(
    (cardId: string, status?: ReflectionStatus, note?: string) => {
      setReflections((prev) => {
        const updated = {
          ...prev,
          [cardId]: { status, note, updatedAt: Date.now() },
        };
        if (currentSessionId) {
          saveReflections(currentSessionId, updated);
        }
        return updated;
      });
    },
    [currentSessionId]
  );

  const loadSessionReflections = useCallback((sessionId: string) => {
    const loaded = getReflections(sessionId);
    setReflections(loaded);
  }, []);

  const resetReflections = useCallback(() => {
    setReflections({});
  }, []);

  return {
    reflections,
    setReflections,
    handleReflectionChange,
    loadSessionReflections,
    resetReflections,
  };
}
