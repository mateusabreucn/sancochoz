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
    line7: "because authenticity hits",
  },
  pt: {
    line1: "sancochoz vem do sentimento",
    line2: "de fazer e acontecer",
    line3: "a ideia sai daí e vem pra cá",
    line4: "e o fluxo de trabalho é no seu tempo",
    line5: "uma forma de construir marca",
    line6: "sem a pressão da performance",
    line7: "porque o que é de verdade funciona",
  },
} as const;

type Lang = keyof typeof aboutText;

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = aboutText[lang];

  const lines = [
    t.line1,
    t.line2,
    "",
    t.line3,
    t.line4,
    "",
    t.line5,
    t.line6,
    t.line7,
  ];
  const langIndex = lang === "en" ? 0 : 1;

  return (
    <div className="flex-1 flex flex-col">
      <div className="w-[85vw] md:w-2/3 flex flex-col mx-auto mt-14 md:mt-20 gap-8 lg:gap-0 pb-12">
        {/* Language Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative grid grid-cols-2 w-24 md:w-32 md:-ml-8"
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-1/2 bg-gray-soft"
            animate={{ x: `${langIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
          {(["en", "pt"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="relative z-10 font-body font-extralight text-sm md:text-lg text-black px-4 py-2 text-center"
            >
              {l.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Grid: text + logo */}
        <div className="w-full flex flex-col items-center md:grid md:grid-cols-2 gap-8 md:gap-12 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-fit whitespace-nowrap text-left md:w-full md:max-w-[480px] md:justify-self-end"
          >
            {lines.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-6" />
              ) : (
                <p
                  key={i}
                  className="font-body text-[clamp(0.85rem,1.5vw,1.2rem)] text-text-muted leading-[1.8]"
                >
                  {line}
                </p>
              ),
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Image
              src="/LogoImage.svg"
              alt="sancochoz"
              width={500}
              height={500}
              className="w-[180px] h-[180px] md:w-auto md:h-auto md:max-w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
