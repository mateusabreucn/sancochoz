"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";

const MIN_SPIN_MS = 600;

export function ShowcaseMobileCurtain() {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const slideRef = useRef<gsap.core.Tween | null>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const exitRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const panel = panelRef.current;
    const logo = logoRef.current;
    if (!panel || !logo) return;

    slideRef.current?.kill();
    spinRef.current?.kill();
    exitRef.current?.kill();
    gsap.killTweensOf([panel, logo]);
    gsap.set(logo, { opacity: 0, rotation: 0 });
    gsap.set(panel, { x: "100%" });

    panel.style.pointerEvents = "auto";
    dispatch({ type: "RESET_ACTIVE" });

    let readyToExit = false;
    let aborted = false;

    const doExit = () => {
      if (aborted) return;
      spinRef.current?.kill();
      gsap.set(logo, { rotation: 0 });

      gsap.to(logo, { opacity: 0, duration: 0.2, ease: "power2.in" });
      exitRef.current = gsap.to(panel, {
        x: "-100%",
        duration: 0.5,
        ease: "power2.inOut",
        delay: 0.1,
        onComplete: () => {
          if (aborted) return;
          gsap.set(panel, { x: "100%" });
          gsap.set(logo, { opacity: 0, rotation: 0 });
          panel.style.pointerEvents = "none";
        },
      });
    };

    // Slide in from right
    slideRef.current = gsap.fromTo(
      panel,
      { x: "100%" },
      {
        x: "0%",
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          if (aborted) return;

          gsap.to(logo, { opacity: 1, duration: 0.2, ease: "power2.out" });

          spinRef.current = gsap.to(logo, {
            rotation: "+=360",
            duration: 0.75,
            ease: "none",
            repeat: -1,
            onRepeat: () => {
              if (readyToExit) doExit();
            },
          });

          setTimeout(() => { readyToExit = true; }, MIN_SPIN_MS);
        },
      }
    );

    return () => {
      aborted = true;
      slideRef.current?.kill();
      spinRef.current?.kill();
      exitRef.current?.kill();
      if (panel) panel.style.pointerEvents = "none";
    };
  }, [state.category, dispatch]);

  return (
    <div className="showcase-mobile-curtain">
      <div
        ref={panelRef}
        className="mobile-curtain-panel"
        style={{ transform: "translateX(100%)" }}
      >
        <div ref={logoRef} style={{ opacity: 0 }}>
          <Image src="/LogoImage.svg" alt="" width={72} height={72} />
        </div>
      </div>
    </div>
  );
}
