"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  variant?: "default" | "about";
}

export default function Header({ variant = "default" }: HeaderProps) {
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
  const highlightOpacity = useTransform(scrollY, [200, 500], [0, 1]);
  const highlightScale = useTransform(scrollY, [200, 500], [0.7, 1]);

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay },
  });

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 shadow-lg h-20 bg-[#FCFCFC]">
        <div className="h-full flex items-center justify-between mx-12 relative">
          {variant === "about" ? (
            <>
              {/* Left: LogoImage */}
              <motion.div {...fade(0)}>
                <Link href="/">
                  <Image
                    src="/LogoImage.svg"
                    alt="sancochoz"
                    width={64}
                    height={36}
                    priority
                  />
                </Link>
              </motion.div>
              {/* Center: LogoTitle with yellow marca-texto */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <motion.div
                  className="relative"
                  {...fade(0.2)}
                >
                  <span className="absolute -inset-1.5 -z-10 bg-[#FACC15]" />
                  <Image
                    src="/LogoTitle.png"
                    alt="sancochoz"
                    width={130}
                    height={22}
                    className="w-auto h-6"
                    priority
                  />
                </motion.div>
              </Link>
              {/* Right: HOME link */}
              <motion.div {...fade(0.4)} className="ml-auto">
                <Link
                  href="/"
                  className="relative tracking-[0.08em] uppercase text-black text-sm leading-none hover:after:opacity-100 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[50%] after:bg-[#FACC15] after:opacity-0 after:transition-opacity after:duration-200 after:-z-10"
                >
                  HOME
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              {/* Left: logo bowl + LogoTitle animada (desktop) */}
              <div className="flex items-center gap-4">
                <motion.div {...fade(0)}>
                  <Link href="/">
                    <Image
                      src="/LogoImage.svg"
                      alt="sancochoz"
                      width={64}
                      height={36}
                      priority
                    />
                  </Link>
                </motion.div>
                {/* Desktop: animada com highlight marca-texto */}
                <div className="hidden lg:block">
                  <motion.div className="relative" style={{ x: titleX }}>
                    <motion.div
                      className="absolute -inset-2 -z-10 bg-[#FACC15]"
                      style={{
                        opacity: highlightOpacity,
                        scaleX: highlightScale,
                      }}
                    />
                    <Image
                      src="/LogoTitle.png"
                      alt="sancochoz"
                      width={130}
                      height={22}
                      className="w-auto h-6"
                      priority
                    />
                  </motion.div>
                </div>
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

              {/* Right side */}
              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-6">
                <motion.div {...fade(0.2)}>
                  <Link
                    href="/about"
                    className="relative tracking-[0.08em] uppercase text-black text-sm leading-none hover:after:opacity-100 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[50%] after:bg-[#FACC15] after:opacity-0 after:transition-opacity after:duration-200 after:-z-10"
                  >
                    ABOUT
                  </Link>
                </motion.div>
                <motion.div {...fade(0.4)}>
                  <a
                    href="#contact"
                    className="relative tracking-[0.08em] uppercase text-black text-sm leading-none hover:after:opacity-100 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[50%] after:bg-[#FACC15] after:opacity-0 after:transition-opacity after:duration-200 after:-z-10"
                  >
                    CONTACT
                  </a>
                </motion.div>
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                {...fade(0.4)}
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[16px] font-medium tracking-[0.08em] uppercase text-black"
              >
                {menuOpen ? "CLOSE" : "MENU"}
              </motion.button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay — only on default variant */}
      {variant !== "about" && menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
          style={{ paddingTop: 90 }}
        >
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-medium tracking-[0.04em] uppercase text-black"
          >
            ABOUT
          </Link>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-medium tracking-[0.04em] uppercase text-black"
          >
            CONTACT
          </a>
        </motion.div>
      )}
    </>
  );
}
