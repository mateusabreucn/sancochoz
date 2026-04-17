"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import CategoryFilter from "./CategoryFilter";
import VideoCard from "./VideoCard";
import { videoData, Category } from "./showcaseData";

export default function ShowcaseDesktop() {
  const [activeCategory, setActiveCategory] = useState<Category>("videomaking");
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<gsap.core.Tween | null>(null);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const translateXRef = useRef(0);
  const draggingRef = useRef(false);
  const singleSetWidthRef = useRef(0);

  const videos = videoData[activeCategory];
  const displayVideos = [...videos, ...videos];

  const getSingleSetWidth = useCallback(() => {
    if (!trackRef.current) return 0;
    const children = trackRef.current.children;
    let w = 0;
    for (let i = 0; i < videos.length && i < children.length; i++) {
      w += (children[i] as HTMLElement).offsetWidth;
    }
    return w;
  }, [videos.length]);

  const wrapPosition = useCallback((x: number) => {
    const sw = singleSetWidthRef.current;
    if (sw <= 0) return x;
    if (x > 0) return x - sw;
    if (x < -sw) return x + sw;
    return x;
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) autoScrollRef.current.kill();
    const singleSetWidth = getSingleSetWidth();
    singleSetWidthRef.current = singleSetWidth;
    autoScrollRef.current = gsap.to(trackRef.current, {
      x: -singleSetWidth,
      duration: singleSetWidth / 40,
      ease: "none",
      repeat: -1,
    });
  }, [getSingleSetWidth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.set(trackRef.current, { x: 0 });
      translateXRef.current = 0;
      singleSetWidthRef.current = getSingleSetWidth();
      startAutoScroll();
    }, 150);
    return () => {
      clearTimeout(timer);
      if (autoScrollRef.current) autoScrollRef.current.kill();
    };
  }, [activeCategory, startAutoScroll, getSingleSetWidth]);

  useEffect(() => {
    if (!autoScrollRef.current) return;
    if (isAnyHovered || isDragging) {
      autoScrollRef.current.pause();
    } else {
      autoScrollRef.current.resume();
    }
  }, [isAnyHovered, isDragging]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!draggingRef.current || !trackRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      velocityRef.current = dx;
      const currentX = gsap.getProperty(trackRef.current, "x") as number;
      const newX = wrapPosition(currentX + dx);
      translateXRef.current = newX;
      gsap.set(trackRef.current, { x: newX });
    };

    const handleUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      const momentum = velocityRef.current * 10;
      const wrappedTarget = wrapPosition(translateXRef.current + momentum);
      gsap.to(trackRef.current, {
        x: wrappedTarget,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          translateXRef.current = gsap.getProperty(trackRef.current, "x") as number;
          startAutoScroll();
        },
      });
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };
  }, [wrapPosition, startAutoScroll]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    translateXRef.current = wrapPosition(gsap.getProperty(trackRef.current, "x") as number);
    singleSetWidthRef.current = getSingleSetWidth();
    if (autoScrollRef.current) autoScrollRef.current.pause();
  };

  return (
    <section className="relative w-full overflow-x-clip">
      <div
        className="relative h-[600px] cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
      >
        <div ref={trackRef} className="flex gap-0 h-full absolute left-0 top-0">
          {displayVideos.map((video, i) => (
            <VideoCard
              key={`${activeCategory}-${video.title}-${i}`}
              src={video.src}
              title={video.title}
              isAnyHovered={isAnyHovered}
              onHoverStart={() => setIsAnyHovered(true)}
              onHoverEnd={() => setIsAnyHovered(false)}
            />
          ))}
        </div>

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>
    </section>
  );
}
