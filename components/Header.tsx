"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Header() {
  const t = useTranslations("nav");
  const { locale } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const [centerOffset, setCenterOffset] = useState(0);
  useEffect(() => {
    const compute = () => {
      const startX = 48 + 64 + 16;
      const titleWidth = 130;
      setCenterOffset(window.innerWidth / 2 - titleWidth / 2 - startX);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const titleX = useTransform(scrollY, [0, 500], [0, centerOffset]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 shadow-lg h-24 bg-[#FCFCFC]">
        <div className="h-full flex items-center justify-between mx-12">
          {/* Left: logo bowl + LogoTitle animada (desktop) */}
          <div className="flex items-center gap-4">
            <Image
              src="/LogoImage.png"
              alt="sancochoz"
              width={64}
              height={36}
              priority
            />
            {/* Desktop: animada */}
            <motion.div className="hidden lg:block" style={{ x: titleX }}>
              <Image
                src="/LogoTitle.png"
                alt="sancochoz"
                width={130}
                height={22}
                className="w-auto h-6"
                priority
              />
            </motion.div>
            {/* Mobile: estática */}
            <div className="lg:hidden">
              <Image
                src="/LogoTitle.png"
                alt="sancochoz"
                width={130}
                height={22}
                style={{ width: "auto", height: 22 }}
                priority
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href={`/${locale}/about`}
              className="tracking-[0.08em] uppercase text-black hover:text-accent hover:font-medium transition-colors"
            >
              {t("about")}
            </Link>
            <a
              href="#contact"
              className="tracking-[0.08em] uppercase text-black hover:text-accent hover:font-medium transition-colors"
            >
              {t("contact")}
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-[16px] font-medium tracking-[0.08em] uppercase text-black"
          >
            {menuOpen ? "CLOSE" : t("menu")}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
          style={{ paddingTop: 90 }}
        >
          <Link
            href={`/${locale}/about`}
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-medium tracking-[0.04em] uppercase text-black"
          >
            {t("about")}
          </Link>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-medium tracking-[0.04em] uppercase text-black"
          >
            {t("contact")}
          </a>
        </motion.div>
      )}
    </>
  );
}
