import Link from "next/link";
import Image from "next/image";
import {
  siteConfig,
  navLinks,
  productCategories,
  whatsappLink,
  whatsappMessages,
  assetPath,
} from "@/lib/config";
import { Mail, Phone, MapPin, Clock } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white/80">
      <div className="container-x section">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-xl font-semibold">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-pill ring-1 ring-white/20">
                <Image
                  src={assetPath("/media/images/gordon/gordon.webp")}
                  alt="Gordon Odhiambo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="leading-none">
                <span className="text-white">Gordon</span>
                <span className="text-accent">SalesGuru</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {siteConfig.person.name} — {siteConfig.person.tagline}. Premium
              custom kitchens, wardrobes, bathrooms and interior fitouts,
              delivered personally across East Africa.
            </p>
            <a
              href={whatsappLink(whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-5"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              What I Offer
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {productCategories.map((c) => (
                <li key={c.key}>
                  <Link href={c.href} className="hover:text-accent">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Visit / Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{siteConfig.showroom.full}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>
                  {siteConfig.hours.weekdays}
                  <br />
                  {siteConfig.hours.saturday}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  WhatsApp Gordon
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Map */}
        <div className="mt-10 overflow-hidden rounded-card ring-1 ring-white/10">
          <iframe
            title="Gordon Sales Guru showroom location on Mombasa Road, Nairobi"
            src={siteConfig.showroom.mapEmbed}
            width="100%"
            height="260"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, display: "block" }}
          />
        </div>
        <a
          href={siteConfig.showroom.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          <MapPin className="h-4 w-4" /> Get directions to the showroom
        </a>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            © {year} {siteConfig.brandName}. All rights reserved.
          </p>
          <p>
            {siteConfig.person.name} · {siteConfig.person.title} · Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
