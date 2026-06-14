import { Star } from "./Icons";
import type { Testimonial } from "@/lib/data";

/**
 * Testimonial card. Edit the `testimonials` array in src/lib/data.ts to add or
 * replace client quotes (names, locations, product type and the quote itself).
 */
export default function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-card bg-white p-6 ring-1 ring-black/5">
      <div className="flex gap-0.5 text-accent" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 border-t border-black/5 pt-4">
        <p className="text-sm font-semibold text-navy">{t.name}</p>
        <p className="text-xs text-ink/60">
          {t.location} · {t.productType}
        </p>
      </figcaption>
    </figure>
  );
}
