"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoCardDesktop } from "./VideoCardDesktop";
import CategoryFilter from "./CategoryFilter";
import { useMarquee } from "./useMarquee";
import type { ShowcaseVideos } from "./showcase.types";

const CARD_W = 300;

interface Props {
  videosByCategory: ShowcaseVideos;
}

export default function ShowcaseDesktop({ videosByCategory }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackVisible, setTrackVisible] = useState(true);
  const firstRender = useRef(true);

  const videos = videosByCategory[state.category];

  // Enough copies to always fill the viewport with some overflow
  const copies = useMemo(() => {
    if (videos.length === 0) return 0;
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

  // Fade out/in on category change
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTrackVisible(false);
    const id = setTimeout(() => setTrackVisible(true), 150);
    return () => clearTimeout(id);
  }, [state.category]);

  return (
    <section className="relative w-full overflow-x-clip">
      <div
        className="relative h-[600px] select-none"
        onPointerLeave={() => dispatch({ type: "RESET_ACTIVE" })}
      >
        {videos.length > 0 ? (
          <div
            ref={trackRef}
            className="flex h-full absolute left-0 top-0 transition-opacity duration-150 motion-reduce:transition-none"
            style={{ opacity: trackVisible ? 1 : 0 }}
          >
            {displayVideos.map((video, i) => (
              <VideoCardDesktop
                key={`${video.id}-${i}`}
                entry={video}
                cardId={`${video.id}-${i}`}
                stackIndex={i}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-bg-alt px-8 text-center">
            <p className="font-body text-lg font-semibold lowercase text-black">
              em breve
            </p>
          </div>
        )}

        <CategoryFilter />
      </div>
    </section>
  );
}
