"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";

const aboutText = {
  en: {
    line1: "sancochoz comes from the feeling",
    line2: "of making things happen",
    line3: "the idea comes from there and lands here",
    line4: "and the workflow is at your own pace",
    line5: "a way to build a brand",
    line6: "without the pressure of performance",
    line7: "because authenticity hits",
    line8: "I'm Gustavo Azevedo",
    line9: "I move between film, photography, and digital spaces, creating visual content that feel cohesive, intentional, and alive",
  },
  pt: {
    line1: "sancochoz vem do sentimento",
    line2: "de fazer e acontecer",
    line3: "a ideia sai daí e vem pra cá",
    line4: "e o fluxo de trabalho é no seu tempo",
    line5: "uma forma de construir marca",
    line6: "sem a pressão da performance",
    line7: "porque o que é de verdade funciona",
    line8: "Sou Gustavo Azevedo",
    line9: "Entre o vídeo, a fotografia e o digital, crio conteúdos visuais que são coesos, intencionais e vivos",
  },
} as const;

export default function AboutPage() {
  const { lang } = useLang();
  const text = aboutText[lang];

  const lines = [
    text.line1,
    text.line2,
    "",
    text.line3,
    text.line4,
    "",
    text.line5,
    text.line6,
    text.line7,
    "",
    text.line8,
    text.line9,
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="w-[85vw] md:w-2/3 flex flex-col mx-auto mt-14 md:mt-20 gap-8 lg:gap-0 pb-12">
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
                  className={`font-body text-[clamp(0.85rem,1.5vw,1.2rem)] text-text-muted leading-[1.8]${i >= lines.length - 2 ? " whitespace-normal" : ""}`}
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
