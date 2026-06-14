const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://gordonsalesguru.com").replace(/\/$/, "");

/**
 * Enumerate blog posts whose publishDate is on or before today.
 * This keeps the sitemap in lock-step with the date-gated blog: the daily
 * GitHub Actions rebuild adds each post to the sitemap the moment it unlocks.
 */
function publishedBlogPaths() {
  const dir = path.join(__dirname, "src", "content", "blog");
  if (!fs.existsSync(dir)) return [];
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data } = matter(raw);
      const slug = data.slug || f.replace(/\.mdx?$/, "");
      const publishDate = data.publishDate ? new Date(data.publishDate) : new Date(0);
      return { slug, publishDate };
    })
    .filter((p) => p.publishDate <= today)
    .map((p) => ({
      loc: `/blog/${p.slug}`,
      changefreq: "monthly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  trailingSlash: true,
  outDir: "out",
  generateIndexSitemap: false,
  // [slug] is a dynamic placeholder; real posts are added via additionalPaths.
  exclude: ["/blog/[slug]", "/404", "/404.html"],
  changefreq: "weekly",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  additionalPaths: async () => publishedBlogPaths(),
};
