"use client";

import { useRef, useState, useEffect } from "react";

interface VideoCardProps {
  src: string;
  title: string;
  isAnyHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export default function VideoCard({
  src,
  title,
  isAnyHovered,
  onHoverStart,
  onHoverEnd,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const userMuted = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const dimmed = isAnyHovered && !isHovered;

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (dimmed) {
      video.pause();
    } else if (!isHovered) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [dimmed, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverStart();
    const video = videoRef.current;
    if (!video) return;
    video.muted = userMuted.current;
    setIsMuted(userMuted.current);
    video.play().catch(() => {});
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsHovered(false);
    onHoverEnd();
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    setIsMuted(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    userMuted.current = !userMuted.current;
    video.muted = userMuted.current;
    setIsMuted(userMuted.current);
  };

  return (
    <div
      className={`
        flex-shrink-0 relative cursor-pointer
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        [-webkit-box-shadow:-20px_0_20px_-5px_rgba(0,0,0,0.3)]
        [box-shadow:-20px_0_20px_-5px_rgba(0,0,0,0.3)]
        ${dimmed ? "grayscale opacity-70" : ""}
        ${isHovered ? "z-30" : "z-0"}
      `}
      style={{
        width: isHovered ? 400 : 300,
        height: isHovered ? "calc(400px * 16 / 9)" : "100%",
        alignSelf: "center",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      <div
        className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-200 pointer-events-none opacity-0 ${isHovered ? "opacity-100" : ""}`}
      >
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

      <div
        className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-200 pointer-events-none opacity-0 ${isHovered ? "opacity-100" : ""}`}
      >
        <p className="text-white text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}
