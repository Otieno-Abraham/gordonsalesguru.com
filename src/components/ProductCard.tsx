import SmartImage from "./SmartImage";
import type { Product } from "@/lib/media";

/** Presentational product card. Used inside the client-side ProductGrid. */
export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: () => void;
}) {
  return (
    <div className="card group flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="relative aspect-[4/3] w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`View ${product.name}`}
      >
        <SmartImage
          src={product.src}
          alt={product.alt}
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
        <span className="badge absolute left-3 top-3 bg-white/90">
          {product.categoryName}
        </span>
      </button>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-navy">{product.name}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-ink/60">
          {product.description}
        </p>
        <button type="button" onClick={onOpen} className="btn-outline mt-auto w-full !py-2 text-xs">
          Get a Quote
        </button>
      </div>
    </div>
  );
}
