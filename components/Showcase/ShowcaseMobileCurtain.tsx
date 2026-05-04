"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";

const MIN_SPIN_MS = 600;

interface Props {
  videosReady: boolean;
  onClosed?: () => void;
}

export function ShowcaseMobileCurtain({ videosReady, onClosed }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isInitialRef = useRef(true);
  const slideRef = useRef<gsap.core.Tween | null>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const exitRef = useRef<gsap.core.Tween | null>(null);
  const videosReadyRef = useRef(videosReady);
  const tryExitRef = useRef<() => void>(() => {});
  const onClosedRef = useRef(onClosed);

  useEffect(() => { onClosedRef.current = onClosed; }, [onClosed]);

  useEffect(() => {
    videosReadyRef.current = videosReady;
    if (videosReady) tryExitRef.current();
  }, [videosReady]);

  useEffect(() => {
    const panel = panelRef.current;
    const logo = logoRef.current;
    if (!panel || !logo) return;

    slideRef.current?.kill();
    spinRef.current?.kill();
    exitRef.current?.kill();
    gsap.killTweensOf([panel, logo]);
    gsap.set(logo, { opacity: 0, rotation: 0 });

    panel.style.pointerEvents = "auto";
    dispatch({ type: "RESET_ACTIVE" });

    const wasInitial = isInitialRef.current;
    isInitialRef.current = false;

    let aborted = false;
    let minElapsed = false;

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

    const tryExit = () => {
      if (aborted) return;
      if (minElapsed && videosReadyRef.current) doExit();
    };
    tryExitRef.current = tryExit;

    const startSpin = () => {
      if (aborted) return;
      gsap.to(logo, { opacity: 1, duration: 0.2, ease: "power2.out" });
      spinRef.current = gsap.to(logo, {
        rotation: "+=360",
        duration: 0.75,
        ease: "none",
        repeat: -1,
        onRepeat: tryExit,
      });
      setTimeout(() => { minElapsed = true; tryExit(); }, MIN_SPIN_MS);
    };

    if (wasInitial) {
      gsap.set(panel, { x: "0%" });
      startSpin();
    } else {
      slideRef.current = gsap.fromTo(
        panel,
        { x: "100%" },
        {
          x: "0%",
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => {
            if (aborted) return;
            onClosedRef.current?.();
            startSpin();
          },
        }
      );
    }

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
      <div ref={panelRef} className="mobile-curtain-panel">
        <div ref={logoRef} style={{ opacity: 0 }}>
          <Image src="/LogoImage.svg" alt="" width={72} height={72} />
        </div>
      </div>
    </div>
  );
}
