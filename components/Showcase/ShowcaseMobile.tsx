"use client";

import { useRef, useMemo } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoCardMobile } from "./VideoCardMobile";
import CategoryFilter from "./CategoryFilter";
import { useMarquee } from "./useMarquee";
import type { ShowcaseVideos } from "./showcase.types";

interface Props {
  videosByCategory: ShowcaseVideos;
}

export default function ShowcaseMobile({ videosByCategory }: Props) {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const trackRef = useRef<HTMLDivElement>(null);

  const videos = videosByCategory[state.category];

  // Mobile: each card is 100vw. Minimum 2 copies for seamless loop.
  const copies = videos.length === 0 ? 0 : Math.max(2, videos.length < 3 ? 4 : 2);
  const displayVideos = useMemo(
    () => Array.from({ length: copies * videos.length }, (_, i) => videos[i % videos.length]),
    [videos, copies]
  );

  useMarquee({
    trackRef,
    paused: state.isDragging,
    pxPerSecond: 60,
    category: state.category,
    itemCount: videos.length,
    enableDrag: true,
    dispatch,
  });

  return (
    <section className="relative w-full overflow-x-clip">
      <div className="relative h-screen select-none">
        {videos.length > 0 ? (
          <div ref={trackRef} className="flex h-full absolute left-0 top-0">
            {displayVideos.map((video, i) => (
              <VideoCardMobile
                key={`${video.id}-${i}`}
                entry={video}
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
