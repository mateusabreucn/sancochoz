import { VideoEntry, Category } from "./showcase.types";

function slugToTitle(filename: string): string {
  return filename
    .replace(/\.mp4$/i, "")
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function makeId(category: Category, filename: string): string {
  const slug = filename
    .replace(/\.mp4$/i, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .toLowerCase();
  return `${category}-${slug}`;
}

const rawData: Record<Category, string[]> = {
  socialmedia: ["APIPC.mp4", "CHQ.mp4", "Imagine.mp4", "RioSambaXP.mp4"],
  videomaking: [
    "Alameda.mp4",
    "Boat Party.mp4",
    "Flora.mp4",
    "Imagine Eventos.mp4",
    "James.mp4",
    "Minha Infância.mp4",
    "RioSamba.mp4",
    "Spot Alameda.mp4",
  ],
  webdesign: ["Amanda.mp4"],
};

const categoryPaths: Record<Category, string> = {
  socialmedia: "/ShowcaseVideos/SocialMedia",
  videomaking: "/ShowcaseVideos/Videomaking",
  webdesign: "/ShowcaseVideos/Website",
};

export const videoData: Record<Category, VideoEntry[]> = Object.fromEntries(
  (Object.entries(rawData) as [Category, string[]][]).map(
    ([category, files]) => [
      category,
      files.map((filename) => ({
        id: makeId(category, filename),
        category,
        src: `${categoryPaths[category]}/${encodeURIComponent(filename)}`,
        title: slugToTitle(filename),
      })),
    ]
  )
) as Record<Category, VideoEntry[]>;
