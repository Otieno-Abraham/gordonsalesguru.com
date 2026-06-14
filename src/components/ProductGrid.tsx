"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import LeadForm from "./LeadForm";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";
import type { Product } from "@/lib/media";
import type { ProductCategoryKey } from "@/lib/config";

const FILTERS: { key: "all" | ProductCategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "kitchens", label: "Kitchen Cabinets" },
  { key: "wardrobes", label: "Wardrobes" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "fitouts", label: "Interior Fitouts" },
];

const PAGE = 24;

export default function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<"all" | ProductCategoryKey>("all");
  const [limit, setLimit] = useState(PAGE);
  const [active, setActive] = useState<Product | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // honour ?category= from category links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category") as ProductCategoryKey | null;
    if (cat && FILTERS.some((f) => f.key === cat)) setFilter(cat);
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [products, filter]
  );

  const visible = filtered.slice(0, limit);

  function selectFilter(key: "all" | ProductCategoryKey) {
    setFilter(key);
    setLimit(PAGE);
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* filter tabs */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => selectFilter(f.key)}
            className={`rounded-pill px-4 py-2 text-sm font-medium transition-base ${
              filter === f.key
                ? "bg-navy text-white"
                : "bg-sky text-blue hover:bg-accent/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink/60">
          New designs in this category are on the way. {""}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue hover:underline">
            Ask Gordon what&apos;s available
          </a>
          .
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={() => setActive(p)} />
            ))}
          </div>
          {limit < filtered.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE)}
                className="btn-outline"
              >
                Load more designs
              </button>
            </div>
          )}
        </>
      )}

      {/* product detail modal */}
      <Modal open={active !== null} onClose={() => setActive(null)} size="xl">
        {active && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] bg-sky md:aspect-auto md:min-h-[24rem]">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-6 lg:p-8">
              <span className="badge w-fit">{active.categoryName}</span>
              <h3 className="mt-3 text-2xl font-semibold text-navy">{active.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{active.description}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                Every design is fully customisable — finishes, dimensions and hardware
                are tailored to your space, then produced, delivered and installed
                personally anywhere in East Africa.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={whatsappLink(whatsappMessages.product(active.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp Gordon about this
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setActive(null);
                    setQuoteOpen(true);
                  }}
                  className="btn-outline w-full"
                >
                  Request a Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* quote form modal */}
      <Modal open={quoteOpen} onClose={() => setQuoteOpen(false)}>
        <div className="p-6 sm:p-8">
          <LeadForm heading="Request a Quote" compact />
        </div>
      </Modal>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card bg-sky p-12 text-center">
      <h3 className="text-lg font-semibold text-navy">
        Our latest designs are being added
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
        New product photography is uploaded regularly. In the meantime, message
        Gordon directly and he&apos;ll send you exactly what you&apos;re looking for.
      </p>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-5"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Chat with Gordon
      </a>
    </div>
  );
}
