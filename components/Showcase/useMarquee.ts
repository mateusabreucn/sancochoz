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
  const singleSetWidthRef = useRef(0);
  const pausedRef = useRef(paused);
  const dispatchRef = useRef(dispatch);
  const reducedMotionRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const lastTickRef = useRef(0);
  const tickRef = useRef<((time: number) => void) | null>(null);

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

    if (tickRef.current) gsap.ticker.remove(tickRef.current);

    gsap.set(trackRef.current, { x: 0 });
    lastTickRef.current = 0;

    const tick = (time: number) => {
      if (!trackRef.current) return;
      const sw = singleSetWidthRef.current;
      if (sw === 0) return;

      if (lastTickRef.current === 0) {
        lastTickRef.current = time;
        return;
      }

      const dt = (time - lastTickRef.current) / 1000;
      lastTickRef.current = time;

      if (dt > 0.5) return;

      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      let x = currentX - pxPerSecond * dt;

      if (x <= -sw) x += sw;

      gsap.set(trackRef.current, { x });
    };

    tickRef.current = tick;
    gsap.ticker.add(tick);
  }, [trackRef, computeWidth, pxPerSecond]);

  const stopMarquee = useCallback(() => {
    if (tickRef.current) {
      gsap.ticker.remove(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(startMarquee);
    return () => {
      cancelAnimationFrame(raf);
      stopMarquee();
    };
  }, [category, startMarquee, stopMarquee]);

  useEffect(() => {
    lastTickRef.current = 0;
  }, [paused]);

  useEffect(() => {
    const parent = trackRef.current?.parentElement;
    if (!parent) return;
    let lastWidth = parent.offsetWidth;
    const ro = new ResizeObserver(() => {
      const newWidth = parent.offsetWidth;
      if (Math.abs(newWidth - lastWidth) < 4) return;
      lastWidth = newWidth;
      singleSetWidthRef.current = computeWidth();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [trackRef, computeWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
      if (e.matches) {
        stopMarquee();
      } else {
        requestAnimationFrame(startMarquee);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [startMarquee, stopMarquee]);

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
          pausedRef.current = false;
          lastTickRef.current = 0;
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
  }, [enableDrag, trackRef]);
}
