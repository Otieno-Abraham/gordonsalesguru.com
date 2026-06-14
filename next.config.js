/** @type {import('next').NextConfig} */

// basePath lets the same build serve from a project subpath
// (e.g. gordon.github.io/gordonsalesguru) or the apex custom domain ("").
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  // Static HTML export for GitHub Pages (production builds only).
  // `next dev` runs as a normal dev server so dynamic routes like /blog/[slug]
  // behave correctly during local development.
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  // GitHub Pages cannot run the Next.js image optimizer.
  images: {
    unoptimized: true,
  },
  // Emit /path/index.html so URLs resolve without a server.
  trailingSlash: true,
  basePath: basePath || undefined,
  reactStrictMode: true,
  // MDX is compiled at build time via next-mdx-remote/rsc.
  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

module.exports = nextConfig;
