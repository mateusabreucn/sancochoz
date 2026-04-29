"use client";

import { useRef, useEffect, useMemo } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoCardDesktop } from "./VideoCardDesktop";
import CategoryFilter from "./CategoryFilter";
import { useMarquee } from "./useMarquee";
import { videoData } from "./showcaseData";

const CARD_W = 300;

export default function ShowcaseDesktop() {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const trackRef = useRef<HTMLDivElement>(null);

  const videos = videoData[state.category];

  // Enough copies to always fill the viewport with some overflow
  const copies = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(2, Math.ceil((vw * 2) / (videos.length * CARD_W)) + 1);
  }, [videos.length]);

  const displayVideos = useMemo(
    () => Array.from({ length: copies * videos.length }, (_, i) => videos[i % videos.length]),
    [videos, copies]
  );

  useMarquee({
    trackRef,
    paused: state.activeVideoId !== null,
    pxPerSecond: 30,
    category: state.category,
    itemCount: videos.length,
    enableDrag: false,
  });

  // Reset active on pointer leave, tab switch, and window blur
  useEffect(() => {
    const reset = () => dispatch({ type: "RESET_ACTIVE" });
    const onVisibility = () => { if (document.hidden) reset(); };
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dispatch]);

  return (
    <section className="relative w-full overflow-x-clip">
      <div
        className="relative h-[600px] select-none"
        onPointerLeave={() => dispatch({ type: "RESET_ACTIVE" })}
      >
        <div ref={trackRef} className="flex h-full absolute left-0 top-0">
          {displayVideos.map((video, i) => (
            <VideoCardDesktop
              key={`${video.id}-${i}`}
              entry={video}
              cardId={`${video.id}-${i}`}
            />
          ))}
        </div>

        <CategoryFilter />
      </div>
    </section>
  );
}
