"use client";

import { useRef, useMemo } from "react";
import { useShowcaseState, useShowcaseDispatch } from "./ShowcaseContext";
import { VideoCardMobile } from "./VideoCardMobile";
import CategoryFilter from "./CategoryFilter";
import { useMarquee } from "./useMarquee";
import { videoData } from "./showcaseData";

export default function ShowcaseMobile() {
  const state = useShowcaseState();
  const dispatch = useShowcaseDispatch();
  const trackRef = useRef<HTMLDivElement>(null);

  const videos = videoData[state.category];

  // Mobile: each card is 100vw. Minimum 2 copies for seamless loop.
  const copies = Math.max(2, videos.length < 3 ? 4 : 2);
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
        <div ref={trackRef} className="flex h-full absolute left-0 top-0">
          {displayVideos.map((video, i) => (
            <VideoCardMobile
              key={`${video.id}-${i}`}
              entry={video}
            />
          ))}
        </div>

        <CategoryFilter />
      </div>
    </section>
  );
}
