"use client";

import { useState, useEffect, useCallback } from "react";
import { HistoryItem, getHistory, saveHistoryItem } from "@/lib/storage";

/**
 * Custom hook to manage decision history list from localStorage.
 */
export function useSessionHistory() {
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      setHistoryList(getHistory());
    } catch (err) {
      console.warn("Failed to load decision history", err);
    }
  }, []);

  const addHistoryItem = useCallback((item: HistoryItem) => {
    try {
      saveHistoryItem(item);
      setHistoryList(getHistory());
    } catch (err) {
      console.warn("Failed to persist session to history", err);
    }
  }, []);

  return {
    historyList,
    setHistoryList,
    addHistoryItem,
  };
}
