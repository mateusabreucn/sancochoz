"use client";

import { ShowcaseProvider } from "./ShowcaseContext";
import ShowcaseMobile from "./ShowcaseMobile";
import ShowcaseDesktop from "./ShowcaseDesktop";
import type { ShowcaseVideos } from "./showcase.types";

interface Props {
  videos: ShowcaseVideos;
}

export default function ShowcaseClient({ videos }: Props) {
  return (
    <ShowcaseProvider>
      <div className="lg:hidden">
        <ShowcaseMobile videosByCategory={videos} />
      </div>
      <div className="hidden lg:block">
        <ShowcaseDesktop videosByCategory={videos} />
      </div>
    </ShowcaseProvider>
  );
}
