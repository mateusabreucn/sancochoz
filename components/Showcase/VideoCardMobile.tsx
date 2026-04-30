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

      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center pointer-events-none text-black">
        <MuteIcon muted={muted} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
        <p className="text-white text-sm font-medium">{entry.title}</p>
      </div>
    </div>
  );
}
