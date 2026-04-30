"use client";

import { useRef, useState, useEffect } from "react";
import { VideoEntry } from "./showcase.types";
import { MuteIcon } from "./MuteIcon";

interface Props {
  entry: VideoEntry;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z" />
    </svg>
  );
}

export function VideoCardMobile({ entry, isActive, muted, onToggleMute }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

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
        onLoadedData={() => setVideoReady(true)}
      />

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {/* Play button — visible only when unmuted (carousel paused) */}
        {!muted && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center z-10 text-black"
            aria-label="Mute and resume carousel"
          >
            <PlayIcon />
          </button>
        )}
        <div
          onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
          className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center z-10 text-black cursor-pointer"
        >
          <MuteIcon muted={muted} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
        <p className="text-white text-sm font-medium">{entry.title}</p>
      </div>
    </div>
  );
}
