import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import { WhatsAppIcon, Mail, MapPin, Clock } from "@/components/Icons";
import { siteConfig, whatsappLink, whatsappMessages } from "@/lib/config";
import { buildMetadata, pageTitle, localBusinessSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Contact — Free Interior Consultation in Nairobi"),
  description:
    "Talk to Gordon Odhiambo about your kitchen, wardrobe, bathroom or interior fitout. WhatsApp, email or visit the Mombasa Road showroom in Nairobi. Responses within 2 hours.",
  path: "/contact",
  keywords: [
    "contact interior expert Nairobi",
    "kitchen cabinets Nairobi consultation",
    "interior fitouts Nairobi contact",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <section className="hero-texture text-white">
        <div className="container-x py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Contact</p>
            <h1 className="mt-3 h1">Let&apos;s Talk About Your Project</h1>
            <p className="mt-5 text-lg text-white/80">
              WhatsApp is the fastest way to reach me, and I am always glad to
              assist by phone, email or with a visit to the showroom. I respond
              within two hours during business hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Contact details */}
          <div>
            <h2 className="h3 text-navy">Get in touch</h2>
            <p className="mt-3 text-base leading-relaxed text-ink/75">
              Whether you&apos;re ready to start or just exploring ideas, I&apos;m happy to help.
              Reach out and tell me a little about your space.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={whatsappLink(whatsappMessages.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-card bg-sky p-4 transition-base hover:ring-2 hover:ring-accent/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-whatsapp text-white">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy">WhatsApp Gordon</span>
                  <span className="block text-sm text-ink/60">Chat directly — fastest response</span>
                </span>
              </a>

              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 rounded-card bg-sky p-4 transition-base hover:ring-2 hover:ring-accent/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-navy text-white">
                  <Mail className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy">Email</span>
                  <span className="block text-sm text-ink/60">{siteConfig.email}</span>
                </span>
              </a>

              <div className="flex items-start gap-4 rounded-card bg-sky p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-navy text-white">
                  <MapPin className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy">Showroom</span>
                  <span className="block text-sm text-ink/60">{siteConfig.showroom.full}</span>
                </span>
              </div>

              <div className="flex items-start gap-4 rounded-card bg-sky p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-navy text-white">
                  <Clock className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-navy">Business hours</span>
                  <span className="block text-sm text-ink/60">
                    {siteConfig.hours.weekdays} · {siteConfig.hours.saturday} · {siteConfig.hours.sunday}
                  </span>
                  <span className="mt-1 block text-sm font-medium text-blue">{siteConfig.hours.note}</span>
                </span>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-card ring-1 ring-black/10">
              <iframe
                title="Gordon Sales Guru showroom location, Mombasa Road, Nairobi"
                src={siteConfig.showroom.mapEmbed}
                width="100%"
                height="280"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          {/* Form */}
          <div className="rounded-card bg-sky p-6 sm:p-8">
            <LeadForm heading="Send Gordon a message" />
            <p className="mt-4 text-center text-xs text-ink/50">
              Looking for inspiration first? Browse{" "}
              <Link href="/products/" className="font-semibold text-blue hover:underline">
                products
              </Link>{" "}
              and{" "}
              <Link href="/projects/" className="font-semibold text-blue hover:underline">
                completed projects
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
