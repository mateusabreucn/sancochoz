"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  variant?: "default" | "about";
}

export default function Header({ variant = "default" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const titleRef = useRef<HTMLDivElement>(null);
  const [titleOffsets, setTitleOffsets] = useState({ start: -300, end: -65 });
  useEffect(() => {
    const compute = () => {
      if (!titleRef.current) return;
      const titleWidth = titleRef.current.getBoundingClientRect().width;
      const logoRightEdge = 48 + 64 + 16; // mx-12 + w-16 + gap-4
      setTitleOffsets({
        start: logoRightEdge - window.innerWidth / 2,
        end: -titleWidth / 2,
      });
    };
    setTimeout(compute, 0);
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const titleX = useTransform(scrollY, [0, 500], [titleOffsets.start, titleOffsets.end]);
  const highlightOpacity = useTransform(scrollY, [200, 500], [0, 1]);
  const highlightScale = useTransform(scrollY, [200, 500], [0.7, 1]);

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay },
  });

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 shadow-lg h-14 lg:h-20 bg-[#FCFCFC]">
        <div className="h-full flex items-center justify-between max-[425px]:mx-3 mx-4 lg:mx-12 relative">
          {variant === "about" ? (
            <>
              {/* Left: LogoImage + LogoTitle */}
              <motion.div
                {...fade(0)}
                className="flex items-center gap-3 lg:gap-4"
              >
                <Link href="/">
                  <Image
                    src="/LogoImage.svg"
                    alt="sancochoz"
                    width={64}
                    height={36}
                    className="w-9 h-auto lg:w-16"
                    priority
                  />
                </Link>
                {/* Mobile: title inline with logo + marca-texto */}
                <Link
                  href="/"
                  className="lg:hidden relative flex items-center"
                >
                  <span className="absolute -inset-1 -z-10 bg-[#FACC15]" />
                  <Image
                    src="/LogoTitle.png"
                    alt="sancochoz"
                    width={130}
                    height={22}
                    className="w-auto h-[15px] block relative z-10"
                    priority
                  />
                </Link>
              </motion.div>
              {/* Center: LogoTitle with yellow marca-texto (desktop only) */}
              <Link
                href="/"
                className="hidden lg:block absolute left-1/2 -translate-x-1/2"
              >
                <motion.div className="relative" {...fade(0.2)}>
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
              <motion.div {...fade(0.4)}>
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
              {/* Left: logo bowl */}
              <div className="flex items-center gap-3 lg:gap-4">
                <motion.div {...fade(0)}>
                  <Link href="/">
                    <Image
                      src="/LogoImage.svg"
                      alt="sancochoz"
                      width={64}
                      height={36}
                      className="w-9 h-auto lg:w-16"
                      priority
                    />
                  </Link>
                </motion.div>
                {/* Mobile: title estática (inline com logo) */}
                <div className="lg:hidden flex items-center">
                  <Image
                    src="/LogoTitle.png"
                    alt="sancochoz"
                    width={130}
                    height={22}
                    className="w-auto h-[15px] block"
                    priority
                  />
                </div>
              </div>

              {/* Desktop: title absolute, anima do logo para o centro */}
              <motion.div
                {...fade(0.1)}
                className="hidden lg:block absolute"
                style={{ left: "50%", x: titleX }}
              >
                <div ref={titleRef} className="relative">
                  <motion.div
                    className="absolute -inset-2 -z-10 bg-[#FACC15]"
                    style={{ opacity: highlightOpacity, scaleX: highlightScale }}
                  />
                  <Image
                    src="/LogoTitle.png"
                    alt="sancochoz"
                    width={130}
                    height={22}
                    className="w-auto h-6"
                    priority
                  />
                </div>
              </motion.div>

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
                className="lg:hidden text-[13px] font-medium tracking-[0.08em] uppercase text-black"
              >
                {menuOpen ? "CLOSE" : "MENU"}
              </motion.button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
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
