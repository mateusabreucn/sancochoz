"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const MIN_MS = 1800;

export function PageLoader() {
  const [gone, setGone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const barTrackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // Entrance — GSAP reads initial scale(0.75)/opacity(0) from inline style
      gsap.to(seamRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.fromTo(
        barRef.current,
        { x: "-100%" },
        { x: "390%", duration: 1.05, ease: "power2.inOut", repeat: -1, delay: 0.5 }
      );
    });

    const dismiss = () => {
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, MIN_MS - elapsed);

      setTimeout(() => {
        const isMobile = window.innerWidth < 1024;

        gsap.to(barTrackRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });

        if (isMobile) {
          gsap.to(overlayRef.current, {
            y: "100%",
            duration: 0.65,
            ease: "power2.inOut",
            delay: 0.15,
            onComplete: () => {
              setGone(true);
              document.body.style.overflow = "";
            },
          });
        } else {
          // Curtain splits — seam follows the right panel movement
          gsap.to(leftRef.current, {
            x: "-100%",
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.15,
          });
          gsap.to(rightRef.current, {
            x: "100%",
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.15,
            onComplete: () => {
              setGone(true);
              document.body.style.overflow = "";
            },
          });
          // Logo moves right alongside the right panel, then fades at the edge
          gsap.to(seamRef.current, {
            x: window.innerWidth * 0.5,
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.15,
          });
          gsap.to(seamRef.current, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            delay: 0.55,
          });
        }
      }, wait);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      ctx.revert();
      window.removeEventListener("load", dismiss);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={overlayRef} className="page-loader">
      <div ref={leftRef} className="page-loader-panel page-loader-left" />
      <div ref={rightRef} className="page-loader-panel page-loader-right" />

      {/* Initial state set inline so server HTML is already correct — no flash */}
      <div
        ref={seamRef}
        className="page-loader-seam"
        style={{ opacity: 0, transform: "translate(-50%, -50%) scale(0.75)" }}
      >
        <Image
          src="/LogoImage.svg"
          alt="sancochoz"
          width={110}
          height={110}
          priority
        />
        <div ref={barTrackRef} className="loader-track">
          <div ref={barRef} className="loader-bar" />
        </div>
      </div>
    </div>
  );
}
