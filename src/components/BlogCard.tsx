import Link from "next/link";
import SmartImage from "./SmartImage";
import { formatDate, type PostMeta } from "@/lib/blog-shared";

/** Blog post card. Server component. Set `featured` for the large hero variant. */
export default function BlogCard({
  post,
  featured = false,
}: {
  post: PostMeta;
  featured?: boolean;
}) {
  const href = `/blog/${post.slug}/`;

  if (featured) {
    return (
      <Link
        href={href}
        className="card group grid overflow-hidden md:grid-cols-2"
      >
        <div className="relative aspect-[16/10] md:aspect-auto">
          <SmartImage
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full"
            imgClassName="group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <div className="flex items-center gap-3 text-xs">
            <span className="badge">{post.category}</span>
            <span className="text-ink/50">{post.readTime}</span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-navy group-hover:text-accent lg:text-2xl">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">
            {post.description}
          </p>
          <p className="mt-4 text-xs text-ink/50">{formatDate(post.publishDate)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="card group flex flex-col">
      <div className="relative aspect-[16/10]">
        <SmartImage
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
        <span className="badge absolute left-3 top-3 bg-white/90">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-navy group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/70">
          {post.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-ink/50">
          <span>{formatDate(post.publishDate)}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
