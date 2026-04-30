import "server-only";

import { unstable_cache } from "next/cache";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import type {
  Category,
  ShowcaseVideos,
  VideoEntry,
} from "@/components/Showcase/showcase.types";

const categories: Category[] = ["videoandphoto", "webdesign", "socialmedia"];

const prefixes: Record<Category, string> = {
  videoandphoto: "showcase/videoandphoto/",
  webdesign: "showcase/webdesign/",
  socialmedia: "showcase/socialmedia/",
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function publicBaseUrl(): string {
  return (
    process.env.R2_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    requiredEnv("R2_PUBLIC_URL")
  ).replace(/\/$/, "");
}

function createClient() {
  return new S3Client({
    region: "auto",
    endpoint: requiredEnv("R2_ENDPOINT"),
    credentials: {
      accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

function keyToId(category: Category, key: string): string {
  return `${category}-${key
    .replace(prefixes[category], "")
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .toLowerCase()}`;
}

function keyToTitle(category: Category, key: string): string {
  return key
    .replace(prefixes[category], "")
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_\s]?/, "")
    .replace(/[-_]/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function keyToPublicUrl(key: string): string {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `${publicBaseUrl()}/${encodedKey}`;
}

async function listVideosByCategory(category: Category): Promise<VideoEntry[]> {
  const client = createClient();
  const bucket = requiredEnv("R2_BUCKET");
  const prefix = prefixes[category];
  const videos: VideoEntry[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const object of response.Contents ?? []) {
      const key = object.Key;
      if (!key || key === prefix || !key.toLowerCase().endsWith(".mp4")) {
        continue;
      }

      videos.push({
        id: keyToId(category, key),
        category,
        src: keyToPublicUrl(key),
        title: keyToTitle(category, key),
      });
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return videos.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" }),
  );
}

async function listShowcaseVideosUncached(): Promise<ShowcaseVideos> {
  const entries = await Promise.all(
    categories.map(
      async (category) =>
        [category, await listVideosByCategory(category)] as const,
    ),
  );

  return Object.fromEntries(entries) as ShowcaseVideos;
}

export const listShowcaseVideos = unstable_cache(
  listShowcaseVideosUncached,
  ["showcase-r2-videos"],
  { revalidate: 60 },
);
