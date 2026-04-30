"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";

const MIN_SPIN_MS = 600; // minimum time before curtain is allowed to open

export function ShowcaseCurtain() {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const curtainRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const closeRef = useRef<gsap.core.Tween | null>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const openRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    gsap.set(leftRef.current, { x: "-100%" });
    gsap.set(rightRef.current, { x: "100%" });
    gsap.set(logoRef.current, { opacity: 0, rotation: 0, xPercent: -50, yPercent: -50 });
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const curtain = curtainRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const logo = logoRef.current;
    if (!curtain || !left || !right || !logo) return;

    // Kill any running animation from a previous category switch
    closeRef.current?.kill();
    spinRef.current?.kill();
    openRef.current?.kill();
    gsap.killTweensOf(logo);

    curtain.style.pointerEvents = "auto";
    dispatch({ type: "RESET_ACTIVE" });

    let readyToOpen = false;
    let aborted = false;

    const doOpen = () => {
      if (aborted) return;
      spinRef.current?.kill();
      // Logo stays at rotation 0 (onRepeat fires when cycle is complete)
      gsap.set(logo, { rotation: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          if (aborted) return;
          gsap.set(logo, { opacity: 0, rotation: 0 });
          curtain.style.pointerEvents = "none";
        },
      });
      openRef.current = tl;
      tl.to(left,  { x: "-100%", duration: 0.55, ease: "power2.inOut" }, 0)
        .to(right, { x: "100%",  duration: 0.55, ease: "power2.inOut" }, 0);
    };

    // Step 1 — close curtains
    closeRef.current = gsap.to([left, right], {
      x: "0%",
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        if (aborted) return;

        // Step 2 — show logo
        gsap.to(logo, { opacity: 1, duration: 0.2, ease: "power2.out" });

        // Step 3 — spin; open only when a full cycle completes AND min time has passed
        spinRef.current = gsap.to(logo, {
          rotation: "+=360",
          duration: 0.75,
          ease: "none",
          repeat: -1,
          onRepeat: () => {
            if (readyToOpen) doOpen();
          },
        });

        // Allow opening after minimum time (aligned to next spin cycle via onRepeat)
        setTimeout(() => { readyToOpen = true; }, MIN_SPIN_MS);
      },
    });

    return () => {
      aborted = true;
      closeRef.current?.kill();
      spinRef.current?.kill();
      openRef.current?.kill();
      curtain.style.pointerEvents = "none";
    };
  }, [state.category, dispatch]);

  return (
    <div ref={curtainRef} className="showcase-curtain">
      <div ref={leftRef} className="curtain-panel curtain-left" />
      <div ref={rightRef} className="curtain-panel curtain-right">
        <div ref={logoRef} className="curtain-logo">
          <Image src="/LogoImage.svg" alt="" width={72} height={72} priority />
        </div>
      </div>
    </div>
  );
}
