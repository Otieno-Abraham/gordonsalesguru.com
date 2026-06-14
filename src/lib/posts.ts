/**
 * posts.ts — MDX blog data layer with date-gated auto-publishing.
 *
 * Posts live in /src/content/blog/*.mdx with frontmatter. A post is only
 * visible once its publishDate is on or before "today" (build time). The daily
 * GitHub Actions rebuild therefore unlocks each scheduled post automatically,
 * with zero manual work.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type Post, type PostMeta } from "./blog-shared";

// Re-export shared types/helpers so server code can import everything from here.
export {
  BLOG_CATEGORIES,
  type BlogCategory,
  type Post,
  type PostMeta,
  formatDate,
} from "./blog-shared";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

function endOfToday(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function readAll(): Post[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = (data.slug as string) || file.replace(/\.mdx?$/, "");
    return {
      title: data.title ?? slug,
      description: data.description ?? "",
      publishDate: data.publishDate ?? "1970-01-01",
      slug,
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      coverImage: data.coverImage ?? "",
      author: data.author ?? "Gordon Odhiambo",
      category: data.category ?? "Tips & Guides",
      readTime: data.readTime ?? "3 min read",
      featured: Boolean(data.featured),
      content,
    } as Post;
  });
}

function isPublished(p: { publishDate: string }): boolean {
  const t = new Date(p.publishDate).getTime();
  if (Number.isNaN(t)) return true; // be permissive on malformed dates
  return t <= endOfToday();
}

/** Published posts, newest first. */
export function getPublishedPosts(): Post[] {
  return readAll()
    .filter(isPublished)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

export function getPublishedMeta(): PostMeta[] {
  return getPublishedPosts().map(({ content, ...meta }) => meta);
}

/** A single published post, or null if missing or still date-locked. */
export function getPostBySlug(slug: string): Post | null {
  const post = readAll().find((p) => p.slug === slug);
  if (!post || !isPublished(post)) return null;
  return post;
}

/** Slugs that should exist as static pages right now (published only). */
export function getPublishedSlugs(): string[] {
  return getPublishedPosts().map((p) => p.slug);
}

/** The featured post: an explicit featured flag wins, else the most recent. */
export function getFeaturedPost(): Post | null {
  const published = getPublishedPosts();
  if (published.length === 0) return null;
  return published.find((p) => p.featured) ?? published[0];
}

export function getRecentPosts(limit = 3): PostMeta[] {
  return getPublishedMeta().slice(0, limit);
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = getPublishedPosts().find((p) => p.slug === slug);
  if (!current) return [];
  const sameCategory = getPublishedMeta().filter(
    (p) => p.slug !== slug && p.category === current.category
  );
  const others = getPublishedMeta().filter(
    (p) => p.slug !== slug && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
