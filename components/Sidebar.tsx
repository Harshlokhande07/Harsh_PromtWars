"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Compass,
  BookOpen,
  Folder,
  History as HistoryIcon,
  Search,
  X,
  Plus,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { HistoryItem } from "@/lib/storage";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewDecision: () => void;
  historyList: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  userName?: string;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNewDecision,
  historyList,
  onSelectHistory,
  userName = "Harsh",
  userEmail = "harsh@blindspot.ai",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"explore" | "library" | "files" | "history">("explore");

  // Sample grouped history
  const defaultHistoryToday = [
    "Accept Google vs AI startup internship offer...",
    "Switch career from Senior Analyst to Founder...",
    "Take $450k mortgage vs investing difference...",
  ];
  const defaultHistoryYesterday = [
    "Join Series-A startup as Founding Engineer...",
    "Relocate from Bangalore to London headquarters...",
  ];
  const defaultHistory7Days = [
    "Quit job to build AI indie micro-SaaS...",
    "Fund equipment purchase vs waiting for cash...",
    "Hire 2 senior engineers vs 4 junior interns...",
  ];

  if (!isOpen) {
    return (
      <div className="hidden md:flex flex-col items-center py-5 px-2 bg-white/60 backdrop-blur-md border-r border-slate-100 w-16 shrink-0 justify-between transition-all">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={onToggle}
            className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-purple-500/20 hover:scale-105 transition-transform"
            title="Expand Sidebar"
          >
            <Image
              src="/logo.png"
              alt="The Blind Sport Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-white transition-colors"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
          {userName.slice(0, 2).toUpperCase()}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-72 bg-white/70 backdrop-blur-md border-r border-slate-100 flex flex-col justify-between h-full shrink-0 transition-all z-20 text-slate-800 select-none">
      {/* Top Header */}
      <div className="p-4 space-y-3.5 border-b border-slate-100/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-purple-500/25 shrink-0 border border-purple-200/50">
              <Image
                src="/logo.png"
                alt="The Blind Sport Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                The Blind Sport
              </span>
              <span className="text-[10px] font-medium text-purple-600 tracking-wide uppercase">
                AI Thinking Canvas
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 rounded-lg transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onNewDecision}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md shadow-zinc-900/10 hover:shadow-zinc-900/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Decision</span>
        </button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search decisions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white border border-slate-200/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 placeholder:text-slate-400 transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-400 bg-slate-200/60 px-1 py-0.2 rounded">
              ⌘K
            </span>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-0.5 pt-1">
          {[
            { id: "explore", label: "Explore Decisions", icon: Compass },
            { id: "library", label: "Reasoning Library", icon: BookOpen },
            { id: "files", label: "Saved Files", icon: Folder },
            { id: "history", label: "History & Reflections", icon: HistoryIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-purple-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Grouped History Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Today */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Today
          </span>
          <div className="space-y-1">
            {historyList.length > 0 ? (
              historyList.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectHistory(item)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-purple-50/60 hover:text-purple-900 text-slate-700 truncate block transition-colors font-medium text-[11px]"
                  title={item.input}
                >
                  {item.input}
                </button>
              ))
            ) : (
              defaultHistoryToday.map((title, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1.5 rounded-lg hover:bg-purple-50/60 hover:text-purple-900 text-slate-600 truncate cursor-pointer transition-colors text-[11px]"
                >
                  {title}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Yesterday */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Yesterday
          </span>
          <div className="space-y-1">
            {defaultHistoryYesterday.map((title, idx) => (
              <div
                key={idx}
                className="px-2 py-1.5 rounded-lg hover:bg-purple-50/60 hover:text-purple-900 text-slate-600 truncate cursor-pointer transition-colors text-[11px]"
              >
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* 7 days */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            7 Days
          </span>
          <div className="space-y-1">
            {defaultHistory7Days.map((title, idx) => (
              <div
                key={idx}
                className="px-2 py-1.5 rounded-lg hover:bg-purple-50/60 hover:text-purple-900 text-slate-600 truncate cursor-pointer transition-colors text-[11px]"
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Widget (Bottom) */}
      <div className="p-3.5 border-t border-slate-100 bg-white/50 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-900 block leading-none">
              {userName}
            </span>
            <span className="text-[10px] text-slate-400 block leading-none">
              {userEmail}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Account Settings"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
