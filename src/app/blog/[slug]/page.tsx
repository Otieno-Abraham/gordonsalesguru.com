import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SmartImage from "@/components/SmartImage";
import MDXContent from "@/components/MDXContent";
import ShareButtons from "@/components/ShareButtons";
import BlogCard from "@/components/BlogCard";
import { WhatsAppIcon, ArrowRight, Calendar, Clock } from "@/components/Icons";
import { siteConfig, whatsappLink, whatsappMessages } from "@/lib/config";
import {
  buildMetadata,
  pageTitle,
  articleSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import {
  getPostBySlug,
  getPublishedSlugs,
  getRelatedPosts,
  formatDate,
} from "@/lib/posts";

// Static export: only build pages for posts whose publishDate has arrived.
// Anything not listed here (future-dated posts, unknown slugs) returns 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: pageTitle("Article") };
  return buildMetadata({
    title: `${post.title} | Gordon Odhiambo`,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishDate,
    keywords: post.keywords,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const path = `/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            path,
            image: post.coverImage,
            datePublished: post.publishDate,
            keywords: post.keywords,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        ]}
      />

      <article>
        {/* Header */}
        <header className="hero-texture text-white">
          <div className="container-x max-w-3xl py-16 lg:py-20">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link href="/blog/" className="text-accent hover:underline">
                Blog
              </Link>
              <span className="text-white/40">/</span>
              <span className="badge">{post.category}</span>
            </div>
            <h1 className="mt-4 h1">{post.title}</h1>
            <p className="mt-4 text-lg text-white/80">{post.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70">
              <span>By {post.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {formatDate(post.publishDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Cover */}
        <div className="bg-white">
          <div className="container-x max-w-4xl -mt-8 lg:-mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-card shadow-lg">
              <SmartImage src={post.coverImage} alt={post.title} className="h-full w-full" priority />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="section bg-white pt-10 lg:pt-12">
          <div className="container-x max-w-3xl">
            <MDXContent source={post.content} />

            <div className="mt-10 border-t border-black/10 pt-6">
              <ShareButtons title={post.title} path={path} />
            </div>

            {/* end CTA */}
            <div className="mt-8 rounded-card bg-navy p-8 text-center text-white">
              <h2 className="text-xl font-semibold">Ready to transform your space?</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
                WhatsApp Gordon directly or fill in the consultation form. He responds within
                2 hours during business hours.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappLink(whatsappMessages.blog(post.title))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp Gordon
                </a>
                <Link href="/contact/" className="btn-outline-light">
                  Open the consultation form
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="section bg-sky">
            <div className="container-x">
              <div className="flex items-end justify-between gap-4">
                <h2 className="h3 text-navy">Related articles</h2>
                <Link href="/blog/" className="btn-outline !py-2 text-sm">
                  All articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
