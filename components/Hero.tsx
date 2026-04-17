"use client";

import { motion } from "framer-motion";
import PolaroidDeck from "./PolaroidDeck";

export default function Hero() {
  return (
    <section className="my-48">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-12 md:gap-8 max-w-[1400px] mx-auto">
        {/* Coluna 1 — Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center md:justify-end md:pr-8 text-center md:text-right order-2 md:order-1"
        >
          <p className="text-sm md:text-lg font-light lowercase text-black/80 whitespace-nowrap">
            let&apos;s make projects we believe in
          </p>
        </motion.div>

        {/* Coluna 2 — Polaroid Deck */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex justify-center items-center w-full order-1 md:order-2 py-12 md:py-0"
        >
          <PolaroidDeck />
        </motion.div>

        {/* Coluna 3 — Botão CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center md:justify-start md:pl-8 order-3"
        >
          <a
            href="#contact"
            className="
              bg-white text-black text-base font-semibold px-20 py-3
              border-2 border-transparent
              transition-all duration-200
              hover:bg-accent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:-translate-y-1 hover:-translate-x-1
              active:translate-y-0 active:translate-x-0 active:shadow-none
              whitespace-nowrap cursor-pointer
            "
          >
            talk to me
          </a>
        </motion.div>
      </div>
    </section>
  );
}
