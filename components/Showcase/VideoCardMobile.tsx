"use client";

import { useRef, useState, useEffect } from "react";
import { VideoEntry } from "./showcase.types";
import { MuteIcon } from "./MuteIcon";

interface Props {
  entry: VideoEntry;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onLoaded?: (id: string) => void;
}

export function VideoCardMobile({ entry, isActive, muted, onToggleMute, onLoaded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

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
      data-vid={entry.id}
      className="flex-shrink-0 relative"
      style={{ width: "100vw", height: "100%" }}
      onClick={onToggleMute}
    >
      {!videoReady && (
        <div className="absolute inset-0 bg-bg-alt animate-pulse" />
      )}

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

      <div
        onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
        className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-white/70 flex items-center justify-center z-[2100] text-black cursor-pointer"
      >
        <MuteIcon muted={muted} />
      </div>
    </div>
  );
}
