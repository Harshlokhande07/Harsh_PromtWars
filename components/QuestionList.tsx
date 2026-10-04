"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface QuestionListProps {
  questions: string[];
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  return (
    <div className="bg-white rounded-card p-5 md:p-6 border border-gray-200 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
          5. Socratic Questions to Sit With
        </h2>
        <span className="text-xs text-gray-500">Uncomfortable, non-leading inquiries</span>
      </div>

      <div className="space-y-3">
        {questions.map((question, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-white hover:border-indigo-100 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed">
              {question}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
