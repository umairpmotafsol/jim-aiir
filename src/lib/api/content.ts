import { cacheLife, cacheTag } from "next/cache";
import postsData from "@/data/posts.json";
import type { Post } from "@/lib/types";

const posts = (postsData as Post[]).toSorted((a, b) => b.date.localeCompare(a.date));

export async function getPosts(limit?: number): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return limit ? posts.slice(0, limit) : posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts", `post:${slug}`);
  return posts.find((p) => p.slug === slug) ?? null;
}
