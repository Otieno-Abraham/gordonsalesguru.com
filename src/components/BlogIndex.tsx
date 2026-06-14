"use client";

import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import { Search, WhatsAppIcon } from "./Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";
import type { PostMeta } from "@/lib/blog-shared";

export default function BlogIndex({
  posts,
  categories,
}: {
  posts: PostMeta[];
  categories: readonly string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const inCat = category === "All" || p.category === category;
      if (!inCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.join(" ").toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [posts, query, category]);

  const searching = query.trim().length > 0 || category !== "All";
  const featured = posts[0];
  const rest = searching ? filtered : filtered.filter((p) => p.slug !== featured?.slug);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_18rem]">
      <div>
        {/* search */}
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles — kitchens, wardrobes, bathrooms…"
            className="w-full rounded-pill border border-black/10 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-base focus:border-accent focus:ring-2 focus:ring-accent/30"
            aria-label="Search articles"
          />
        </div>

        {/* category chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-pill px-3.5 py-1.5 text-xs font-medium transition-base ${
                category === c ? "bg-navy text-white" : "bg-sky text-blue hover:bg-accent/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* featured (only when not searching) */}
        {!searching && featured && (
          <div className="mb-8">
            <BlogCard post={featured} featured />
          </div>
        )}

        {rest.length === 0 ? (
          <p className="rounded-card bg-sky p-10 text-center text-sm text-ink/60">
            No articles match your search yet. Try a different term, or{" "}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:underline">
              ask Gordon directly
            </a>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </div>

      {/* sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-card bg-navy p-6 text-white">
          <h2 className="text-lg font-semibold">Talk to Gordon</h2>
          <p className="mt-2 text-sm text-white/75">
            Reading up on your project? Skip the research and get tailored advice
            straight from Gordon — he responds within 2 hours.
          </p>
          <a
            href={whatsappLink(whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4 w-full"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </aside>
    </div>
  );
}
