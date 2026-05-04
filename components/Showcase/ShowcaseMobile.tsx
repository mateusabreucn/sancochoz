"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoCardMobile } from "./VideoCardMobile";
import CategoryFilter from "./CategoryFilter";
import { ShowcaseMobileCurtain } from "./ShowcaseMobileCurtain";
import { ArrowButton } from "./ArrowButton";
import { useMarquee } from "./useMarquee";
import type { ShowcaseVideos } from "./showcase.types";

interface Props {
  videosByCategory: ShowcaseVideos;
}

export default function ShowcaseMobile({ videosByCategory }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const carouselPaused = !muted;
  const toggleMute = useCallback(() => setMuted(m => !m), []);

  const [displayCategory, setDisplayCategory] = useState(state.category);
  const commitCategory = useCallback(() => {
    setDisplayCategory(state.category);
  }, [state.category]);

  const videos = videosByCategory[displayCategory] ?? [];

  const copies = videos.length === 0 ? 0 : Math.max(2, videos.length < 3 ? 4 : 2);
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

  const { scrollBy, snapToNearest } = useMarquee({
    trackRef,
    paused: state.isDragging || carouselPaused,
    pxPerSecond: 80,
    category: displayCategory,
    itemCount: videos.length,
    enableDrag: !carouselPaused,
    dispatch,
  });

  // Snap-center the active video whenever the carousel pauses (user tapped to unmute)
  useEffect(() => {
    if (!carouselPaused) return;
    if (typeof window === "undefined") return;
    snapToNearest(window.innerWidth);
  }, [carouselPaused, snapToNearest]);

  useEffect(() => {
    if (videos.length === 0) {
      setActiveVideoId(null);
      return;
    }

    const check = () => {
      const track = trackRef.current;
      if (!track) return;
      const x = gsap.getProperty(track, "x") as number;
      const vw = window.innerWidth;
      const centeredIdx = Math.round(-x / vw);
      const wrappedIdx = ((centeredIdx % videos.length) + videos.length) % videos.length;
      const id = videos[wrappedIdx]?.id ?? null;
      setActiveVideoId(prev => (prev === id ? prev : id));
    };

    check();
    const interval = setInterval(check, 200);
    return () => clearInterval(interval);
  }, [videos]);

  return (
    <section className="relative w-full overflow-x-clip">
      <div className="relative h-screen select-none overflow-hidden">
        {videos.length > 0 ? (
          <div ref={trackRef} className="flex h-full absolute left-0 top-0">
            {displayVideos.map((video, i) => (
              <VideoCardMobile
                key={`${video.id}-${i}`}
                entry={video}
                isActive={activeVideoId === video.id}
                muted={muted}
                onToggleMute={toggleMute}
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

        {videos.length > 0 && carouselPaused && (
          <>
            <ArrowButton
              direction="left"
              onClick={() => scrollBy(window.innerWidth)}
            />
            <ArrowButton
              direction="right"
              onClick={() => scrollBy(-window.innerWidth)}
            />
          </>
        )}

        <CategoryFilter />
        <ShowcaseMobileCurtain videosReady={videosReady} onClosed={commitCategory} />
      </div>
    </section>
  );
}
