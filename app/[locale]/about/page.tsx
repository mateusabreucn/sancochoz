"use client";

import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const t = useTranslations();
  const { locale } = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLang = locale as string;

  const switchLang = (lang: string) => {
    router.push(`/${lang}/about`);
  };

  const lines = [
    t("about.line1"),
    t("about.line2"),
    "",
    t("about.line3"),
    t("about.line4"),
    "",
    t("about.line5"),
    t("about.line6"),
    t("about.line7"),
  ];

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-[64px]">
        <div className="max-w-page mx-auto h-full flex items-center justify-between px-[var(--spacing-page-x)]">
          <Link href={`/${locale}`}>
            <Image src="/LogoImage.png" alt="sancochoz" width={32} height={32} className="w-8 h-8" />
          </Link>
          <Image src="/LogoTitle.png" alt="sancochoz" width={140} height={24} className="h-5 w-auto" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[13px] font-medium tracking-[0.08em] uppercase text-black"
          >
            {menuOpen ? "CLOSE" : t("nav.menu")}
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 pt-[64px]"
        >
          <Link
            href={`/${locale}`}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-medium tracking-[0.04em] uppercase text-black"
          >
            HOME
          </Link>
          <a
            href={`/${locale}#contact`}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-medium tracking-[0.04em] uppercase text-black"
          >
            {t("nav.contact")}
          </a>
        </motion.div>
      )}

      {/* Content */}
      <main className="pt-[calc(64px+3rem)] pb-24 px-[var(--spacing-page-x)]">
        <div className="max-w-page mx-auto">
          {/* Language Toggle */}
          <div className="flex gap-2 mb-12">
            <button
              onClick={() => switchLang("en")}
              className={`font-body text-sm tracking-[0.05em] px-3 py-1 transition-colors ${
                currentLang === "en"
                  ? "bg-bg-alt text-black border border-border"
                  : "text-text-muted bg-transparent border border-transparent"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("pt")}
              className={`font-body text-sm tracking-[0.05em] px-3 py-1 transition-colors ${
                currentLang === "pt"
                  ? "bg-bg-alt text-black border border-border"
                  : "text-text-muted bg-transparent border border-transparent"
              }`}
            >
              PT
            </button>
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
                  href={`/${locale}#contact`}
                  className="inline-block border-[1.5px] border-black text-black font-body font-medium text-[0.95rem] tracking-[0.02em] px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-200"
                >
                  {t("hero.cta")}
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
    </>
  );
}
