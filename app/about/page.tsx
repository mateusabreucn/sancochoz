"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const aboutText = {
  en: {
    line1: "sancochoz comes from the feeling",
    line2: "of making things happen",
    line3: "the idea comes from there and lands here",
    line4: "and the workflow is at your own pace",
    line5: "a way to build a brand",
    line6: "without the pressure of performance",
    line7: "knowing that truth performs",
    cta: "talk to me",
  },
  pt: {
    line1: "sancochoz vem do sentimento",
    line2: "de fazer e acontecer",
    line3: "a ideia sai daí e vem pra cá",
    line4: "e o fluxo de trabalho é no seu tempo",
    line5: "uma forma de construir marca",
    line6: "sem a pressão da performance",
    line7: "sabendo que a verdade performa",
    cta: "talk to me",
  },
} as const;

type Lang = keyof typeof aboutText;

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = aboutText[lang];

  const lines = [t.line1, t.line2, "", t.line3, t.line4, "", t.line5, t.line6, t.line7];

  return (
    <main className="pt-[calc(90px+3rem)] pb-24 px-[var(--spacing-page-x)]">
      <div className="max-w-page mx-auto">
        {/* Language Toggle */}
        <div className="flex gap-2 mb-12">
          {(["en", "pt"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`font-body text-sm tracking-[0.05em] px-3 py-1 transition-colors ${
                lang === l
                  ? "bg-bg-alt text-black border border-border"
                  : "text-text-muted bg-transparent border border-transparent"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Two columns: text + logo */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-24">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[480px]"
          >
            {lines.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-6" />
              ) : (
                <p
                  key={i}
                  className="font-body text-[clamp(0.9rem,1.5vw,1.1rem)] text-text-muted leading-[1.8]"
                >
                  {line}
                </p>
              )
            )}

            {/* CTA */}
            <div className="mt-10">
              <a
                href="/#contact"
                className="inline-block border-[1.5px] border-black text-black font-body font-medium text-[0.95rem] tracking-[0.02em] px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-200"
              >
                {t.cta}
              </a>
            </div>
          </motion.div>

          {/* Large Bowl Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Image
              src="/LogoImage.png"
              alt="sancochoz"
              width={350}
              height={350}
              className="w-[clamp(200px,25vw,350px)] h-auto"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
