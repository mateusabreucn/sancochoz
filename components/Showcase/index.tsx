import { listShowcaseVideos } from "@/lib/r2-client";
import ShowcaseClient from "./ShowcaseClient";

export const revalidate = 60;

export default async function Showcase() {
  const videos = await listShowcaseVideos();

  return <ShowcaseClient videos={videos} />;
}
