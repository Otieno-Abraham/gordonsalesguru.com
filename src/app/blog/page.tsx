import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import BlogIndex from "@/components/BlogIndex";
import SectionHeading from "@/components/SectionHeading";
import { buildMetadata, pageTitle, breadcrumbSchema } from "@/lib/seo";
import { getPublishedMeta, BLOG_CATEGORIES } from "@/lib/posts";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Interior Design Blog — Kitchens, Wardrobes & More"),
  description:
    "Expert guides on kitchen design, fitted wardrobes, bathroom trends and interiors for Nairobi and East African homes. Practical advice from Gordon Odhiambo.",
  path: "/blog",
  keywords: [
    "kitchen design Nairobi",
    "wardrobe ideas Kenya",
    "bathroom trends Nairobi",
    "East Africa interiors blog",
  ],
});

export default function BlogPage() {
  const posts = getPublishedMeta();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <section className="hero-texture text-white">
        <div className="container-x py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">The Blog</p>
            <h1 className="mt-3 h1">Ideas, guides &amp; inspiration for your home</h1>
            <p className="mt-5 text-lg text-white/80">
              Practical, no-nonsense advice on kitchens, wardrobes, bathrooms and interiors
              — written for East African homes and budgets.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          {posts.length === 0 ? (
            <div className="rounded-card bg-sky p-12 text-center">
              <SectionHeading title="New articles are on the way" intro="Check back soon — fresh guides publish regularly." />
            </div>
          ) : (
            <BlogIndex posts={posts} categories={BLOG_CATEGORIES} />
          )}
        </div>
      </section>
    </>
  );
}
