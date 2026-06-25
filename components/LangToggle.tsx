"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "fr" | "en";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all hover:scale-110 ${className}`}
      style={{
        background: "var(--neutral-100)",
        color: "var(--brand-500)",
        border: "1px solid var(--neutral-200)",
      }}
    >
      {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
    </button>
  );
}
