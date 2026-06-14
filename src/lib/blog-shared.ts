/**
 * blog-shared.ts — types and pure helpers shared by client AND server code.
 *
 * This module must never import `fs` or any other server-only API, because
 * client components (BlogCard, BlogIndex) import from it. The fs-based readers
 * live in posts.ts, which is server-only.
 */

export const BLOG_CATEGORIES = [
  "Kitchen Design",
  "Wardrobe Ideas",
  "Bathroom Trends",
  "Nairobi Homes",
  "East Africa Interiors",
  "Tips & Guides",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface PostMeta {
  title: string;
  description: string;
  publishDate: string; // ISO date (YYYY-MM-DD)
  slug: string;
  keywords: string[];
  coverImage: string;
  author: string;
  category: string;
  readTime: string;
  featured: boolean;
}

export interface Post extends PostMeta {
  content: string;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
