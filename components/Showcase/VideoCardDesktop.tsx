"use client";

import { useRef, useState, useEffect } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoEntry } from "./showcase.types";
import { MuteIcon } from "./MuteIcon";
import { VideoSkeleton } from "./Skeleton";

interface Props {
  entry: VideoEntry;
  cardId: string;
}

const INACTIVE_W = 300;
const ACTIVE_W = 400;
const ACTIVE_H = `${Math.round(ACTIVE_W * (16 / 9))}px`;

export function VideoCardDesktop({ entry, cardId }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const isActive = state.activeVideoId === cardId;
  const isDimmed = state.activeVideoId !== null && !isActive;

  // Lazy-mount: only load video element once card has been visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasBeenInView) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHasBeenInView(true); },
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasBeenInView]);

  // Play / pause on active state change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.preload = "auto";
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      video.preload = "metadata";
    }
  }, [isActive]);

  // Apply global mute when active
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;
    video.muted = state.globalMuted;
  }, [state.globalMuted, isActive]);

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0 overflow-hidden cursor-pointer select-none"
      style={{
        width: isActive ? ACTIVE_W : INACTIVE_W,
        height: isActive ? ACTIVE_H : "100%",
        alignSelf: "center",
        transition: "width 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1)",
        filter: isDimmed ? "grayscale(1)" : "none",
        boxShadow: isActive
          ? "0 0 40px 10px rgba(0,0,0,0.45), -20px 0 20px -5px rgba(0,0,0,0.3)"
          : "-20px 0 20px -5px rgba(0,0,0,0.3)",
        zIndex: isActive ? 30 : 0,
      }}
      onMouseEnter={() => dispatch({ type: "SET_ACTIVE", id: cardId })}
    >
      {!videoReady && <VideoSkeleton />}

      {hasBeenInView && (
        <video
          ref={videoRef}
          src={entry.src}
          preload="metadata"
          loop
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${videoReady ? "opacity-100" : "opacity-0"}`}
          onLoadedData={() => setVideoReady(true)}
          onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
        />
      )}

      {isActive && (
        <button
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center z-10 text-black"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "TOGGLE_MUTE" });
          }}
        >
          <MuteIcon muted={state.globalMuted} />
        </button>
      )}

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
          <p className="text-white text-sm font-medium">{entry.title}</p>
        </div>
      )}
    </div>
  );
}
