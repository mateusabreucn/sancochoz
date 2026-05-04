"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";

const MIN_SPIN_MS = 600; // minimum time before curtain is allowed to open

interface Props {
  videosReady: boolean;
  onClosed?: () => void;
}

export function ShowcaseCurtain({ videosReady, onClosed }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const curtainRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isInitialRef = useRef(true);
  const closeRef = useRef<gsap.core.Tween | null>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const openRef = useRef<gsap.core.Timeline | null>(null);
  const videosReadyRef = useRef(videosReady);
  const tryOpenRef = useRef<() => void>(() => {});
  const onClosedRef = useRef(onClosed);

  useEffect(() => { onClosedRef.current = onClosed; }, [onClosed]);

  useEffect(() => {
    videosReadyRef.current = videosReady;
    if (videosReady) tryOpenRef.current();
  }, [videosReady]);

  useEffect(() => {
    gsap.set(logoRef.current, { opacity: 0, rotation: 0, xPercent: -50, yPercent: -50 });
  }, []);

  useEffect(() => {
    const curtain = curtainRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    const logo = logoRef.current;
    if (!curtain || !left || !right || !logo) return;

    closeRef.current?.kill();
    spinRef.current?.kill();
    openRef.current?.kill();
    gsap.killTweensOf(logo);

    curtain.style.pointerEvents = "auto";
    dispatch({ type: "RESET_ACTIVE" });

    const wasInitial = isInitialRef.current;
    isInitialRef.current = false;

    let aborted = false;
    let minElapsed = false;

    const doOpen = () => {
      if (aborted) return;
      spinRef.current?.kill();
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

    const tryOpen = () => {
      if (aborted) return;
      if (minElapsed && videosReadyRef.current) doOpen();
    };
    tryOpenRef.current = tryOpen;

    const startSpin = () => {
      if (aborted) return;
      gsap.to(logo, { opacity: 1, duration: 0.2, ease: "power2.out" });
      spinRef.current = gsap.to(logo, {
        rotation: "+=360",
        duration: 0.75,
        ease: "none",
        repeat: -1,
        onRepeat: tryOpen,
      });
      setTimeout(() => { minElapsed = true; tryOpen(); }, MIN_SPIN_MS);
    };

    if (wasInitial) {
      gsap.set([left, right], { x: "0%" });
      startSpin();
    } else {
      gsap.set(logo, { opacity: 0, rotation: 0 });
      closeRef.current = gsap.to([left, right], {
        x: "0%",
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          if (aborted) return;
          onClosedRef.current?.();
          startSpin();
        },
      });
    }

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
        <div ref={logoRef} className="curtain-logo" style={{ opacity: 0 }}>
          <Image src="/LogoImage.svg" alt="" width={72} height={72} priority />
        </div>
      </div>
    </div>
  );
}
