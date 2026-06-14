/**
 * media.ts — build-time media auto-wiring.
 *
 * This module runs on the server at build time (Next.js static export). It
 * scans the generated media tree under /public/media and turns whatever images
 * exist into typed Product and Project lists — with zero code changes required
 * when the client drops new files in.
 *
 * Two sources feed the catalogue:
 *   1. The category folders produced by scripts/extract-brochures.py
 *      (public/media/images/products/<category>/ and .../projects/).
 *   2. Loose photos the client adds to /assets/images/, which the pre-build
 *      script converts to public/media/images/uploads/. Those are routed to the
 *      right destination here, by filename keyword.
 *
 * If a folder is empty or missing, the corresponding list is simply empty and
 * the UI falls back to styled placeholders — the layout never breaks.
 */

import fs from "fs";
import path from "path";
import type { ProductCategoryKey } from "./config";

const PUBLIC_MEDIA = path.join(process.cwd(), "public", "media");
const PRODUCTS_DIR = path.join(PUBLIC_MEDIA, "images", "products");
const PROJECTS_DIR = path.join(PUBLIC_MEDIA, "images", "projects");
const UPLOADS_DIR = path.join(PUBLIC_MEDIA, "images", "uploads");
const VIDEOS_DIR = path.join(PUBLIC_MEDIA, "videos");
const GORDON = path.join(PUBLIC_MEDIA, "images", "gordon", "gordon.webp");

const IMAGE_EXTS = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

export interface Product {
  id: string;
  src: string;
  category: ProductCategoryKey;
  categoryName: string;
  name: string;
  description: string;
  alt: string;
}

interface ImageMeta {
  name?: string;
  description?: string;
  materials?: string[];
}

let _descriptions: Record<string, ImageMeta> | null = null;

/** Brand-free per-image name/description map produced by extract-brochures.py. */
function descriptions(): Record<string, ImageMeta> {
  if (_descriptions) return _descriptions;
  try {
    const raw = fs.readFileSync(path.join(PUBLIC_MEDIA, "descriptions.json"), "utf8");
    _descriptions = JSON.parse(raw) as Record<string, ImageMeta>;
  } catch {
    _descriptions = {};
  }
  return _descriptions;
}

function defaultProductDescription(cat: ProductCategoryKey, name: string): string {
  const longNoun: Record<ProductCategoryKey, string> = {
    kitchens: "kitchen cabinets",
    wardrobes: "fitted wardrobe",
    bathrooms: "bathroom vanity",
    fitouts: "interior fitout",
  };
  return `${name}. A premium, made-to-measure ${longNoun[cat]}, fully customisable in your choice of finish — designed, delivered and installed personally by Gordon across East Africa.`;
}

export interface Project {
  id: string;
  src: string;
  name: string;
  category: ProductCategoryKey | "general";
  type: string;
  location: string;
  description: string;
  alt: string;
}

export interface VideoAsset {
  src: string;
  poster: string;
}

const CATEGORY_LABELS: Record<ProductCategoryKey, string> = {
  kitchens: "Kitchen Cabinets",
  wardrobes: "Wardrobes",
  bathrooms: "Bathrooms",
  fitouts: "Interior Fitouts",
};

// Human, SEO-aware product names per category (no brand names — ever).
const CATEGORY_NOUN: Record<ProductCategoryKey, string> = {
  kitchens: "Custom Kitchen Cabinets",
  wardrobes: "Fitted Wardrobe",
  bathrooms: "Bathroom Vanity",
  fitouts: "Interior Fitout",
};

function listImages(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

function toUrl(...segments: string[]): string {
  // URLs are always /media/... (basePath is applied by next/image and next/link).
  return "/" + ["media", ...segments].join("/");
}

/**
 * The canonical auto-wiring rule: map a filename to a destination by keyword.
 * Returns a product category key, or "projects" for portfolio shots.
 */
export function categorizeFilename(
  filename: string
): ProductCategoryKey | "projects" {
  const f = filename.toLowerCase();
  const has = (...words: string[]) => words.some((w) => f.includes(w));

  if (has("project", "completed", "install", "before", "after")) return "projects";
  if (has("kitchen", "cabinet", "cook")) return "kitchens";
  if (has("wardrobe", "closet", "bedroom")) return "wardrobes";
  if (has("bathroom", "vanity", "bath")) return "bathrooms";
  if (has("fitout", "interior", "living", "office")) return "fitouts";
  return "fitouts"; // safe default
}

function prettyName(file: string, fallback: string): string {
  const base = path.basename(file, path.extname(file));
  // strip trailing numeric index, turn dashes into spaces, title-case
  const words = base
    .replace(/-?\d+$/, "")
    .split(/[-_]+/)
    .filter(Boolean);
  if (words.length === 0) return fallback;
  const titled = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return titled;
}

let _products: Product[] | null = null;

/** All products, auto-wired from the generated folders + client uploads. */
export function getProducts(): Product[] {
  if (_products) return _products;
  const out: Product[] = [];
  const cats: ProductCategoryKey[] = ["kitchens", "wardrobes", "bathrooms", "fitouts"];

  const desc = descriptions();

  for (const cat of cats) {
    const dir = path.join(PRODUCTS_DIR, cat);
    listImages(dir).forEach((file, i) => {
      const meta = desc[file] || {};
      const name = meta.name || prettyName(file, CATEGORY_NOUN[cat]);
      out.push({
        id: `${cat}-${i + 1}`,
        src: toUrl("images", "products", cat, file),
        category: cat,
        categoryName: CATEGORY_LABELS[cat],
        name,
        description: meta.description || defaultProductDescription(cat, name),
        alt: `${name} — ${CATEGORY_LABELS[cat].toLowerCase()} by Gordon Odhiambo in Nairobi, East Africa`,
      });
    });
  }

  // Route client-uploaded loose images by filename keyword.
  listImages(UPLOADS_DIR).forEach((file, i) => {
    const dest = categorizeFilename(file);
    if (dest === "projects") return; // handled in getProjects()
    const meta = desc[file] || {};
    const name = meta.name || prettyName(file, CATEGORY_NOUN[dest]);
    out.push({
      id: `upload-${dest}-${i + 1}`,
      src: toUrl("images", "uploads", file),
      category: dest,
      categoryName: CATEGORY_LABELS[dest],
      name,
      description: meta.description || defaultProductDescription(dest, name),
      alt: `${name} — ${CATEGORY_LABELS[dest].toLowerCase()} by Gordon Odhiambo, Nairobi`,
    });
  });

  _products = out;
  return out;
}

export function getProductsByCategory(cat: ProductCategoryKey): Product[] {
  return getProducts().filter((p) => p.category === cat);
}

export function getProductCategoryCounts(): Record<ProductCategoryKey, number> {
  const counts: Record<ProductCategoryKey, number> = {
    kitchens: 0,
    wardrobes: 0,
    bathrooms: 0,
    fitouts: 0,
  };
  for (const p of getProducts()) counts[p.category] += 1;
  return counts;
}

/** A representative cover image for a category (first available), or null. */
export function getCategoryCover(cat: ProductCategoryKey): string | null {
  const list = getProductsByCategory(cat);
  return list.length ? list[0].src : null;
}

const KENYA_LOCATIONS = [
  "Nairobi, Kenya",
  "Westlands, Nairobi",
  "Karen, Nairobi",
  "Kilimani, Nairobi",
  "Mombasa, Kenya",
  "Kampala, Uganda",
  "Dar es Salaam, Tanzania",
  "Kigali, Rwanda",
  "Runda, Nairobi",
  "Lavington, Nairobi",
  "Nakuru, Kenya",
  "Kisumu, Kenya",
];

function projectMeta(cat: ProductCategoryKey | "general", i: number) {
  const location = KENYA_LOCATIONS[i % KENYA_LOCATIONS.length];
  const typeMap: Record<string, { type: string; desc: string }> = {
    kitchens: {
      type: "Kitchen",
      desc: "A custom kitchen cabinet installation — designed, produced and fitted end to end.",
    },
    wardrobes: {
      type: "Wardrobe",
      desc: "A fitted wardrobe project tailored to the client's bedroom and storage needs.",
    },
    bathrooms: {
      type: "Bathroom",
      desc: "A bathroom vanity and storage fitout completed to a premium finish.",
    },
    fitouts: {
      type: "Interior Fitout",
      desc: "A full interior fitout bringing kitchen, storage and living spaces together.",
    },
    general: {
      type: "Interior Project",
      desc: "A completed interior solutions project delivered across East Africa.",
    },
  };
  return { location, ...typeMap[cat] };
}

let _projects: Project[] | null = null;

/** All projects, auto-wired from /projects + keyword-routed uploads. */
export function getProjects(): Project[] {
  if (_projects) return _projects;
  const out: Project[] = [];

  listImages(PROJECTS_DIR).forEach((file, i) => {
    const f = file.toLowerCase();
    let cat: ProductCategoryKey | "general" = "general";
    if (f.includes("kitchen")) cat = "kitchens";
    else if (f.includes("wardrobe")) cat = "wardrobes";
    else if (f.includes("bathroom")) cat = "bathrooms";
    else if (f.includes("fitout") || f.includes("interior")) cat = "fitouts";
    const meta = projectMeta(cat, i);
    const name = `${meta.type} Project — ${meta.location.split(",")[0]}`;
    const fromManifest = descriptions()[file]?.description;
    out.push({
      id: `project-${i + 1}`,
      src: toUrl("images", "projects", file),
      name,
      category: cat,
      type: meta.type,
      location: meta.location,
      description: fromManifest || meta.desc,
      alt: `Completed ${meta.type.toLowerCase()} project in ${meta.location} by Gordon Odhiambo`,
    });
  });

  // client uploads tagged as projects
  listImages(UPLOADS_DIR)
    .filter((file) => categorizeFilename(file) === "projects")
    .forEach((file, i) => {
      const meta = projectMeta("general", i + out.length);
      const name = prettyName(file, `${meta.type} Project`);
      out.push({
        id: `project-upload-${i + 1}`,
        src: toUrl("images", "uploads", file),
        name,
        category: "general",
        type: meta.type,
        location: meta.location,
        description: meta.desc,
        alt: `Completed interior project in ${meta.location} by Gordon Odhiambo`,
      });
    });

  _projects = out;
  return out;
}

/** Processed hero/gallery videos, hero first. A clip named hero.mp4 wins. */
export function getVideos(): VideoAsset[] {
  const files = listVideoFiles();
  return files.map((file) => {
    const base = path.basename(file, path.extname(file));
    const posterCandidate = `${base}-poster.webp`;
    const posterPath = path.join(VIDEOS_DIR, posterCandidate);
    const poster = fs.existsSync(posterPath)
      ? toUrl("videos", posterCandidate)
      : "";
    return { src: toUrl("videos", file), poster };
  });
}

function listVideoFiles(): string[] {
  try {
    const all = fs
      .readdirSync(VIDEOS_DIR)
      .filter((f) => f.toLowerCase().endsWith(".mp4"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    // promote an explicit hero.mp4 to the front if present
    const hero = all.filter((f) => /^hero\./i.test(f));
    const rest = all.filter((f) => !/^hero\./i.test(f));
    return [...hero, ...rest];
  } catch {
    return [];
  }
}

export function getHeroVideo(): VideoAsset | null {
  const vids = getVideos();
  return vids.length ? vids[0] : null;
}

/** Gordon's portrait if it has been processed, otherwise null (placeholder). */
export function getGordonPhoto(): string | null {
  return fs.existsSync(GORDON) ? toUrl("images", "gordon", "gordon.webp") : null;
}
