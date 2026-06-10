"use client";

import { useRef, useState, useEffect } from "react";
import { VideoEntry } from "./showcase.types";
import { MuteIcon } from "./MuteIcon";

interface Props {
  entry: VideoEntry;
  isActive: boolean;
  muted: boolean;
  eagerMount?: boolean;
  onToggleMute: () => void;
  onLoaded?: (id: string) => void;
}

export function VideoCardMobile({ entry, isActive, muted, eagerMount, onToggleMute, onLoaded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(eagerMount ?? false);
  const [videoReady, setVideoReady] = useState(false);

  // Lazy-mount: load the video one full screen before it becomes visible
  useEffect(() => {
    if (eagerMount) return;
    const el = containerRef.current;
    if (!el || hasBeenInView) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHasBeenInView(true); },
      { rootMargin: "0px 100% 0px 100%", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasBeenInView, eagerMount]);

  const handleLoaded = () => {
    setVideoReady(true);
    onLoaded?.(entry.id);
  };

  const handleError = () => {
    onLoaded?.(entry.id);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.muted = muted;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, muted]);

  return (
    <div
      ref={containerRef}
      data-vid={entry.id}
      className="flex-shrink-0 relative"
      style={{ width: "100vw", height: "100%" }}
      onClick={onToggleMute}
    >
      {!videoReady && (
        <div className="absolute inset-0 bg-bg-alt animate-pulse" />
      )}

      {hasBeenInView && (
        <video
          ref={videoRef}
          src={entry.src}
          preload="auto"
          loop
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
          onLoadedData={handleLoaded}
          onError={handleError}
        />
      )}

      <div
        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
        className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-white/70 flex items-center justify-center z-[2100] text-black cursor-pointer"
      >
        <MuteIcon muted={muted} />
      </div>
    </div>
  );
}
