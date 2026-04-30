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
  const reducedMotionRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

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
    if (reducedMotionRef.current) return;
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

  // Resize observer: recompute on container resize (ignore sub-pixel changes from scrollbars)
  useEffect(() => {
    const parent = trackRef.current?.parentElement;
    if (!parent) return;
    let lastWidth = parent.offsetWidth;
    const ro = new ResizeObserver(() => {
      const newWidth = parent.offsetWidth;
      if (Math.abs(newWidth - lastWidth) < 4) return;
      lastWidth = newWidth;
      if (tweenRef.current) tweenRef.current.kill();
      requestAnimationFrame(startMarquee);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [trackRef, startMarquee]);

  // Respect prefers-reduced-motion changes at runtime
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        tweenRef.current?.kill();
        tweenRef.current = null;
      } else {
        requestAnimationFrame(startMarquee);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [startMarquee]);

  // Drag (mobile only) — direction-lock: vertical scroll passes through
  useEffect(() => {
    if (!enableDrag) return;
    const parent = trackRef.current?.parentElement;
    if (!parent) return;

    parent.style.touchAction = "pan-y";

    let dragging = false;
    let directionDecided = false;
    let isHorizontal = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastMoveTime = 0;
    let velocityPx = 0;

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
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastMoveTime = Date.now();
      velocityPx = 0;
      dragging = true;
      directionDecided = false;
      isHorizontal = false;
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || !trackRef.current) return;

      if (!directionDecided) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;

        directionDecided = true;
        isHorizontal = Math.abs(dx) > Math.abs(dy);

        if (!isHorizontal) {
          dragging = false;
          return;
        }

        e.preventDefault();
        tweenRef.current?.pause();
        dispatchRef.current?.({ type: "SET_DRAGGING", dragging: true });
      }

      if (!isHorizontal) return;

      const now = Date.now();
      const dt = Math.max(1, now - lastMoveTime);
      const dx = e.clientX - lastX;
      velocityPx = velocityPx * 0.5 + (dx / dt) * 0.5;
      lastX = e.clientX;
      lastMoveTime = now;
      gsap.set(trackRef.current, { x: wrap(getX() + dx) });
    };

    const onUp = () => {
      if (!dragging) return;

      if (!directionDecided || !isHorizontal) {
        dragging = false;
        dispatchRef.current?.({ type: "SET_DRAGGING", dragging: false });
        return;
      }

      dragging = false;
      const momentum = velocityPx * 16 * 20;
      const target = wrap(getX() + momentum);
      const duration = Math.min(1.6, Math.max(0.4, Math.abs(velocityPx) * 0.8));
      gsap.to(trackRef.current, {
        x: target,
        duration,
        ease: "power3.out",
        onComplete: () => {
          dispatchRef.current?.({ type: "SET_DRAGGING", dragging: false });

          const sw = singleSetWidthRef.current;
          if (!sw || !trackRef.current) {
            requestAnimationFrame(startMarquee);
            return;
          }

          // Resume marquee from current position instead of snapping to 0
          const wx = wrap(gsap.getProperty(trackRef.current, "x") as number);
          if (tweenRef.current) tweenRef.current.kill();
          gsap.set(trackRef.current, { x: wx });
          tweenRef.current = gsap.to(trackRef.current, {
            x: wx - sw,
            duration: sw / pxPerSecond,
            ease: "none",
            repeat: -1,
          });
          if (pausedRef.current) tweenRef.current.pause();
        },
      });
    };

    parent.addEventListener("pointerdown", onDown);
    document.addEventListener("pointermove", onMove, { passive: false });
    document.addEventListener("pointerup", onUp);

    return () => {
      parent.style.touchAction = "";
      parent.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [enableDrag, trackRef, startMarquee]);
}
