import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import HeroVideo from "@/components/HeroVideo";
import ProductGrid from "@/components/ProductGrid";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";
import { buildMetadata, pageTitle, breadcrumbSchema } from "@/lib/seo";
import { getProducts, getHeroVideo } from "@/lib/media";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Kitchen Cabinets, Wardrobes & Bathroom Designs"),
  description:
    "Browse premium custom kitchen cabinets, fitted wardrobes, bathroom vanities and interior fitouts. Made-to-measure designs delivered across Nairobi and East Africa.",
  path: "/products",
  keywords: [
    "custom kitchen cabinets Kenya",
    "fitted wardrobes Nairobi",
    "bathroom vanities Nairobi",
    "interior fitouts Nairobi",
  ],
});

export default function ProductsPage() {
  const products = getProducts();
  const hero = getHeroVideo();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />

      {/* Hero with background video */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          <HeroVideo src={hero?.src} poster={hero?.poster} />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="container-x relative py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Our Products</p>
            <h1 className="mt-3 h1">Premium kitchens, wardrobes, bathrooms &amp; fitouts</h1>
            <p className="mt-5 text-lg text-white/80">
              Every piece is custom-built to your space and finished to a premium standard —
              then delivered and installed by Gordon, anywhere in East Africa.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(whatsappMessages.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Gordon
              </a>
              <Link href="/projects/" className="btn-outline-light">
                See completed projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid with filters */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="The Collection"
            title="Explore the designs"
            intro="Filter by category and tap any design to see it larger and request a tailored quote. New photography is added regularly."
          />
          <div className="mt-12">
            <ProductGrid products={products} />
          </div>
        </div>
      </section>

      {/* Bottom CTA lead form */}
      <section className="section bg-sky">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Found something you love?</p>
            <h2 className="mt-2 h2 text-navy">Get a tailored quote</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Share a few details about your space and the style you&apos;re drawn to. Gordon
              will follow up within two hours with honest advice and clear next steps. Not
              sure where to start? Explore the{" "}
              <Link href="/projects/" className="font-semibold text-blue hover:underline">
                completed projects
              </Link>{" "}
              or read the{" "}
              <Link href="/blog/" className="font-semibold text-blue hover:underline">
                design guides
              </Link>
              .
            </p>
          </div>
          <div className="rounded-card bg-white p-6 sm:p-8 ring-1 ring-black/5">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
