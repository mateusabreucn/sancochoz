"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PolaroidDeck from "./PolaroidDeck";

function usePolaroidScale() {
  const [scale, setScale] = useState(0.75);
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setScale(vw >= 375 ? 0.75 : (vw / 375) * 0.75);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

export default function Hero() {
  const polaroidScale = usePolaroidScale();

  return (
    <section className="mb-36 my-28 lg:my-48">
      <div className="flex flex-col lg:grid lg:grid-cols-3 items-center gap-12 lg:gap-8 max-w-[1400px] mx-auto px-6 lg:px-0">
        {/* Tagline — mobile: acima do polaroid | desktop: coluna esquerda */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center lg:justify-end lg:pr-8 text-center lg:text-right order-1"
        >
          <p className="text-base lg:text-lg font-light lowercase text-black/80">
            let&apos;s make projects we believe in
          </p>
        </motion.div>

        {/* Polaroid Deck — coluna central */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex justify-center items-start order-2"
        >
          {/* Mobile: escala dinâmica, offset compensa deck à direita */}
          <div
            className="lg:hidden"
            style={{
              width: 330 * polaroidScale,
              height: 380 * polaroidScale,
              marginLeft: 38 * polaroidScale,
            }}
          >
            <div
              style={{
                transform: `scale(${polaroidScale})`,
                transformOrigin: "top left",
              }}
            >
              <PolaroidDeck />
            </div>
          </div>
          {/* Desktop: offset fixo */}
          <div className="hidden lg:block" style={{ marginLeft: 20 }}>
            <PolaroidDeck />
          </div>
        </motion.div>

        {/* Botão CTA — mobile: abaixo do polaroid | desktop: coluna direita */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center lg:justify-start lg:pl-8 order-3"
        >
          <a
            href="#contact"
            className="
              relative overflow-hidden group
              bg-white text-black font-semibold
              text-sm px-12 py-1.5
              lg:text-base lg:px-20 lg:py-3
              border-2 border-transparent
              transition-all duration-200
              hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:-translate-y-1 hover:-translate-x-1
              active:translate-y-0 active:translate-x-0 active:shadow-none
              whitespace-nowrap cursor-pointer
            "
          >
            <span className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
            <span className="relative z-10">talk to me</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
