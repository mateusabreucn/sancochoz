"use client";

import { useRef, useState, useEffect } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoEntry } from "./showcase.types";
import { MuteIcon } from "./MuteIcon";

interface Props {
  entry: VideoEntry;
}

export function VideoCardMobile({ entry }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasBeenInView) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHasBeenInView(true); },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasBeenInView]);

  // Play / pause based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          video.muted = state.globalMuted;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(containerRef.current!);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBeenInView]);

  // Apply global mute changes to playing video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = state.globalMuted;
  }, [state.globalMuted]);

  return (
    <div
      ref={containerRef}
      className="flex-shrink-0 relative"
      style={{ width: "100vw", height: "100%" }}
      onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
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
          onLoadedData={() => setVideoReady(true)}
        />
      )}

      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center pointer-events-none text-black">
        <MuteIcon muted={state.globalMuted} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
        <p className="text-white text-sm font-medium">{entry.title}</p>
      </div>
    </div>
  );
}
