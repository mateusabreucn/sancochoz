"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import CategoryFilter from "./CategoryFilter";
import { videoData, Category } from "./showcaseData";

function MobileVideoCard({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleReady = () => {
      video.muted = true;
      video.play().catch(() => {});
    };
    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.addEventListener("canplay", handleReady);
    }
    return () => video.removeEventListener("canplay", handleReady);
  }, [src]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      className="flex-shrink-0 relative"
      style={{ width: "100vw", height: "100%" }}
      onClick={toggleMute}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center pointer-events-none">
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
        <p className="text-white text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}

export default function ShowcaseMobile() {
  const [activeCategory, setActiveCategory] = useState<Category>("videomaking");
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
    if (typeof window === "undefined") return 0;
    return videos.length * window.innerWidth;
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
      duration: singleSetWidth / 100,
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
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    translateXRef.current = wrapPosition(gsap.getProperty(trackRef.current, "x") as number);
    singleSetWidthRef.current = getSingleSetWidth();
    if (autoScrollRef.current) autoScrollRef.current.pause();
  };

  return (
    <section className="relative w-full overflow-x-clip">
      <div
        className="relative h-screen cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
      >
        <div ref={trackRef} className="flex h-full absolute left-0 top-0">
          {displayVideos.map((video, i) => (
            <MobileVideoCard
              key={`${activeCategory}-${video.title}-${i}`}
              src={video.src}
              title={video.title}
            />
          ))}
        </div>

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>
    </section>
  );
}
