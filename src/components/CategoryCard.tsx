import Link from "next/link";
import SmartImage from "./SmartImage";
import { ArrowRight } from "./Icons";

/** Product-category card for the homepage grid. Server component. */
export default function CategoryCard({
  name,
  blurb,
  href,
  cover,
  count,
}: {
  name: string;
  blurb: string;
  href: string;
  cover: string | null;
  count: number;
}) {
  return (
    <Link href={href} className="card group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
      <div className="relative aspect-[4/3]">
        <SmartImage
          src={cover}
          alt={`${name} — premium designs by Gordon Odhiambo in Nairobi, East Africa`}
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{name}</h3>
          {count > 0 && (
            <span className="text-xs text-white/80">{count} designs</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-sm text-ink/70">{blurb}</p>
        <ArrowRight className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
