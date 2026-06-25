"use client";

import ThemeToggle from "./ThemeToggle";
import { LangToggle } from "./LangToggle";

export default function ContentNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-md bg-white/80 dark:bg-[#1a1814]/80">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl">🐾</span>
          <span className="font-black text-lg text-[#F59500]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            ParcAChien
          </span>
          <span className="hidden sm:inline text-[10px] font-bold text-[#7C6EF5] bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-900">
            PACA
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl no-underline transition-all"
            style={{ color: "var(--neutral-500)", background: "var(--neutral-100)", border: "1px solid var(--neutral-200)" }}
          >
            🗺️ Carte
          </a>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
