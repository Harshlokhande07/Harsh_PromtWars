"use client";

import React from "react";
import { X, Clock, Trash2, ArrowRight } from "lucide-react";
import { HistoryItem } from "@/lib/storage";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectSession: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSession,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-gray-900">Decision History</h3>
              <span className="text-xs text-gray-400">({history.length})</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500 space-y-2">
              <Clock className="w-8 h-8 text-gray-300 mx-auto" />
              <p>No previous decisions saved in this browser yet.</p>
              <p className="text-[11px] text-gray-400">
                Your analyses and reflections are saved locally in private storage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const dateStr = new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-white transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>{dateStr}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-semibold uppercase text-[9px]">
                        {item.mode}
                      </span>
                    </div>

                    <p className="text-xs text-gray-800 font-medium line-clamp-2">
                      {item.input}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSession(item);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
                      >
                        <span>Open Reflection</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded"
                        title="Delete this history entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={onClearAll}
              className="text-rose-600 hover:text-rose-800 font-medium"
            >
              Clear all history
            </button>
            <span className="text-[11px] text-gray-400">Stored in your browser only</span>
          </div>
        )}
      </div>
    </div>
  );
};
