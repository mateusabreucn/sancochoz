"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations, type Lang, type T } from "@/lib/i18n/translations";

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "en" || stored === "pt") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as T }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
