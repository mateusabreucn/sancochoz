"use client";

import { useRef, useEffect, useCallback, RefObject } from "react";
import gsap from "gsap";
import { ShowcaseAction } from "./showcase.types";

interface UseMarqueeOptions {
  trackRef: RefObject<HTMLDivElement>;
  paused: boolean;
  pxPerSecond: number;
  category: string;
  itemCount: number;
  enableDrag: boolean;
  dispatch?: React.Dispatch<ShowcaseAction>;
}

export function useMarquee({
  trackRef,
  paused,
  pxPerSecond,
  category,
  itemCount,
  enableDrag,
  dispatch,
}: UseMarqueeOptions) {
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const singleSetWidthRef = useRef(0);
  const pausedRef = useRef(paused);
  const dispatchRef = useRef(dispatch);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { dispatchRef.current = dispatch; }, [dispatch]);

  const computeWidth = useCallback(() => {
    if (!trackRef.current) return 0;
    const children = Array.from(trackRef.current.children) as HTMLElement[];
    return children
      .slice(0, itemCount)
      .reduce((sum, el) => sum + el.offsetWidth, 0);
  }, [trackRef, itemCount]);

  const startMarquee = useCallback(() => {
    if (!trackRef.current) return;
    const sw = computeWidth();
    if (sw === 0) return;
    singleSetWidthRef.current = sw;

    if (tweenRef.current) tweenRef.current.kill();
    gsap.set(trackRef.current, { x: 0 });

    tweenRef.current = gsap.to(trackRef.current, {
      x: -sw,
      duration: sw / pxPerSecond,
      ease: "none",
      repeat: -1,
    });

    if (pausedRef.current) tweenRef.current.pause();
  }, [trackRef, computeWidth, pxPerSecond]);

  // Restart when category changes (new video set, new width)
  useEffect(() => {
    const raf = requestAnimationFrame(startMarquee);
    return () => {
      cancelAnimationFrame(raf);
      tweenRef.current?.kill();
    };
  }, [category, startMarquee]);

  // Pause / resume based on external signal
  useEffect(() => {
    if (!tweenRef.current) return;
    if (paused) tweenRef.current.pause();
    else tweenRef.current.resume();
  }, [paused]);

  // Resize observer: recompute on container resize
  useEffect(() => {
    const parent = trackRef.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => {
      if (tweenRef.current) tweenRef.current.kill();
      requestAnimationFrame(startMarquee);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [trackRef, startMarquee]);

  // Drag (mobile only)
  useEffect(() => {
    if (!enableDrag) return;
    const parent = trackRef.current?.parentElement;
    if (!parent) return;

    let dragging = false;
    let lastX = 0;
    let velocity = 0;

    const getX = () =>
      gsap.getProperty(trackRef.current!, "x") as number;

    const wrap = (x: number) => {
      const sw = singleSetWidthRef.current;
      if (!sw) return x;
      if (x > 0) return x - sw;
      if (x < -sw) return x + sw;
      return x;
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      tweenRef.current?.pause();
      dispatchRef.current?.({ type: "SET_DRAGGING", dragging: true });
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || !trackRef.current) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx;
      gsap.set(trackRef.current, { x: wrap(getX() + dx) });
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const target = wrap(getX() + velocity * 10);
      gsap.to(trackRef.current, {
        x: target,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          dispatchRef.current?.({ type: "SET_DRAGGING", dragging: false });
          // Re-start marquee cleanly after momentum settles
          requestAnimationFrame(startMarquee);
        },
      });
    };

    parent.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);

    return () => {
      parent.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [enableDrag, trackRef, startMarquee]);
}
