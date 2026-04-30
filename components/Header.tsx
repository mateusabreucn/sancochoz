"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import type { Lang } from "@/lib/i18n/translations";

const LogoBg = () => (
  <div className="absolute inset-0 -z-10 bg-accent" />
);

const LogoBgMotion = ({ opacity }: { opacity: MotionValue<number> }) => (
  <motion.div className="absolute inset-0 -z-10 bg-accent" style={{ opacity }} />
);

interface HeaderProps {
  variant?: "default" | "about";
}

const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay },
});

const navLinkClass =
  "relative text-sm font-medium tracking-[0.1em] uppercase " +
  "after:content-[''] after:absolute after:bottom-1 after:left-0 after:right-0 " +
  "after:h-[0.45em] after:bg-accent after:-z-10 after:opacity-0 " +
  "hover:after:opacity-100 after:transition-opacity after:duration-200";

function LangToggle() {
  const { lang, setLang } = useLang();
  const langIndex = lang === "en" ? 0 : 1;
  return (
    <div className="relative grid grid-cols-2 w-16 shrink-0">
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 bg-gray-soft"
        animate={{ x: `${langIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
      {(["en", "pt"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="relative z-10 font-body font-extralight text-xs text-black px-2 py-1.5 text-center"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const LogoTitle = ({ size = "desktop" }: { size?: "mobile" | "desktop" }) => (
  <Image
    src="/LogoTitle.png"
    alt="sancochoz"
    width={130}
    height={22}
    className={`w-auto relative z-10 ${size === "mobile" ? "h-[15px]" : "h-[22px]"}`}
    priority
  />
);

export default function Header({ variant = "default" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();
  const { scrollY } = useScroll();
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleTranslate, setTitleTranslate] = useState(0);

  useEffect(() => {
    const compute = () => {
      if (!titleRef.current) return;
      const rect = titleRef.current.getBoundingClientRect();
      const naturalCenter = rect.left + rect.width / 2;
      setTitleTranslate(window.innerWidth / 2 - naturalCenter);
    };
    setTimeout(compute, 50);
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const titleX = useTransform(scrollY, [0, 300], [0, titleTranslate]);
  const highlightOpacity = useTransform(scrollY, [100, 300], [0, 1]);

  return (
    <>
      <header className="sticky top-0 z-[200] h-14 lg:h-20 bg-white shadow-lg">
        {/* ── Mobile layout ── */}
        <div className="lg:hidden h-full flex items-center px-4 relative">
          <motion.div {...fade(0)}>
            <Link href="/">
              <Image
                src="/LogoImage.svg"
                alt="sancochoz"
                width={28}
                height={28}
                className="w-10 h-10"
                priority
              />
            </Link>
          </motion.div>

          <motion.div
            {...fade(0.1)}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <div className="relative px-3 py-1.5">
              <LogoBg />
              {variant === "about" ? (
                <Link href="/">
                  <LogoTitle size="mobile" />
                </Link>
              ) : (
                <LogoTitle size="mobile" />
              )}
            </div>
          </motion.div>

          <motion.div {...fade(0.3)} className="ml-auto flex items-center gap-3">
            {variant === "about" ? (
              <Link href="/" className={navLinkClass}>
                {t.nav.home}
              </Link>
            ) : (
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu"
                className="flex flex-col items-center gap-1.5"
              >
                <span className="block w-7 h-0.5 bg-black" />
                <span className="block w-7 h-0.5 bg-black" />
              </button>
            )}
          </motion.div>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden lg:flex h-full items-center px-12 relative">
          {/* Logo icon — always left */}
          <motion.div {...fade(0)}>
            <Link href="/">
              <Image
                src="/LogoImage.svg"
                alt="sancochoz"
                width={40}
                height={40}
                className="w-16 h-16"
                priority
              />
            </Link>
          </motion.div>

          {/* Logo title — main page: starts next to icon, animates to center on scroll */}
          {variant === "default" && (
            <motion.div
              ref={titleRef}
              className="ml-1.5"
              style={{ x: titleX }}
              {...fade(0.1)}
            >
              <div className="relative px-3 py-2 mb-1.5">
                <LogoBgMotion opacity={highlightOpacity} />
                <LogoTitle size="desktop" />
              </div>
            </motion.div>
          )}

          {/* Logo title — about page: always centered */}
          {variant === "about" && (
            <motion.div
              {...fade(0.1)}
              className="absolute left-1/2 -translate-x-1/2"
            >
              <Link href="/">
                <div className="relative px-3 py-2">
                  <LogoBg />
                  <LogoTitle size="desktop" />
                </div>
              </Link>
            </motion.div>
          )}

          {/* Nav — always right */}
          <motion.nav
            {...fade(0.3)}
            className="ml-auto flex items-center gap-6"
          >
            <LangToggle />
            {variant === "about" ? (
              <Link href="/" className={navLinkClass}>
                {t.nav.home}
              </Link>
            ) : (
              <>
                <Link href="/about" className={navLinkClass}>
                  {t.nav.about}
                </Link>
                <a href="#contact" className={navLinkClass}>
                  {t.nav.contact}
                </a>
              </>
            )}
          </motion.nav>
        </div>
      </header>

      {/* ── Mobile overlay menu ── */}
      {variant !== "about" && (
        <motion.div
          initial={false}
          animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-[300] bg-white ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="absolute top-4 right-4 text-2xl font-light leading-none"
          >
            ✕
          </button>

          <div className="flex flex-col items-center pt-24 gap-10">
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass + " text-2xl"}
            >
              {t.nav.about}
            </Link>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass + " text-2xl"}
            >
              {t.nav.contact}
            </a>
            <LangToggle />
          </div>
        </motion.div>
      )}
    </>
  );
}
