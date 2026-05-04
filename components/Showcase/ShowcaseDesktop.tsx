"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoCardDesktop } from "./VideoCardDesktop";
import CategoryFilter from "./CategoryFilter";
import { ShowcaseCurtain } from "./ShowcaseCurtain";
import { ArrowButton } from "./ArrowButton";
import { useMarquee } from "./useMarquee";
import type { ShowcaseVideos } from "./showcase.types";

const CARD_W = 340;

interface Props {
  videosByCategory: ShowcaseVideos;
}

export default function ShowcaseDesktop({ videosByCategory }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const trackRef = useRef<HTMLDivElement>(null);

  const [displayCategory, setDisplayCategory] = useState(state.category);
  const commitCategory = useCallback(() => {
    setDisplayCategory(state.category);
  }, [state.category]);

  const videos = videosByCategory[displayCategory] ?? [];

  const copies = useMemo(() => {
    if (videos.length === 0) return 0;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    return Math.max(2, Math.ceil((vw * 2) / (videos.length * CARD_W)) + 1);
  }, [videos.length]);

  const displayVideos = useMemo(
    () => Array.from({ length: copies * videos.length }, (_, i) => videos[i % videos.length]),
    [videos, copies]
  );

  const [loadedIds, setLoadedIds] = useState<Set<string>>(() => new Set());
  const handleVideoLoaded = useCallback((id: string) => {
    setLoadedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);
  useEffect(() => { setLoadedIds(new Set()); }, [displayCategory]);
  const videosReady = videos.length === 0 || videos.every((v) => loadedIds.has(v.id));

  const { scrollBy } = useMarquee({
    trackRef,
    paused: state.activeVideoId !== null,
    pxPerSecond: 45,
    category: displayCategory,
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
        {videos.length > 0 ? (
          <div ref={trackRef} className="flex h-full absolute left-0 top-0">
            {displayVideos.map((video, i) => (
              <VideoCardDesktop
                key={`${video.id}-${i}`}
                entry={video}
                cardId={`${video.id}-${i}`}
                stackIndex={i}
                eagerMount={i < videos.length}
                onLoaded={handleVideoLoaded}
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

        {videos.length > 0 && (
          <>
            <ArrowButton
              direction="left"
              onClick={() => scrollBy(CARD_W)}
              onMouseEnter={() => dispatch({ type: "RESET_ACTIVE" })}
            />
            <ArrowButton
              direction="right"
              onClick={() => scrollBy(-CARD_W)}
              onMouseEnter={() => dispatch({ type: "RESET_ACTIVE" })}
            />
          </>
        )}

        <CategoryFilter />
        <ShowcaseCurtain videosReady={videosReady} onClosed={commitCategory} />
      </div>
    </section>
  );
}
