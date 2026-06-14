"use client";

import { useEffect, useState } from "react";
import { ShowcaseProvider } from "./ShowcaseContext";
import ShowcaseMobile from "./ShowcaseMobile";
import ShowcaseDesktop from "./ShowcaseDesktop";
import type { ShowcaseVideos } from "./showcase.types";

interface Props {
  videos: ShowcaseVideos;
}

export default function ShowcaseClient({ videos }: Props) {
  // Render only the active variant: a CSS-hidden <video preload="auto">
  // still downloads, so keeping both trees mounted doubles the bandwidth
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <ShowcaseProvider>
      {isDesktop !== true && (
        <div className="lg:hidden">
          <ShowcaseMobile videosByCategory={videos} />
        </div>
      )}
      {isDesktop !== false && (
        <div className="hidden lg:block">
          <ShowcaseDesktop videosByCategory={videos} />
        </div>
      )}
    </ShowcaseProvider>
  );
}
