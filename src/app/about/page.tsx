import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SmartImage from "@/components/SmartImage";
import ProcessSteps from "@/components/ProcessSteps";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { WhatsAppIcon, Calendar, MapPin, Clock, Check } from "@/components/Icons";
import { siteConfig, whatsappLink, whatsappMessages } from "@/lib/config";
import { buildMetadata, pageTitle, personSchema, localBusinessSchema, breadcrumbSchema } from "@/lib/seo";
import { getGordonPhoto } from "@/lib/media";
import { aboutBio } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("About Gordon Odhiambo — Sales Executive"),
  description:
    "Meet Gordon Odhiambo, a Nairobi-based Sales Executive specialising in premium custom kitchens, wardrobes, bathrooms and interior fitouts across East Africa. Book a showroom visit.",
  path: "/about",
  keywords: [
    "Gordon Odhiambo",
    "Gordon Odhiambo interior",
    "kitchen sales consultant Nairobi",
    "interior solutions expert East Africa",
  ],
});

export default function AboutPage() {
  const gordon = getGordonPhoto();

  return (
    <>
      <JsonLd
        data={[
          personSchema(),
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      {/* Hero / bio */}
      <section className="hero-texture text-white">
        <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow text-accent">About</p>
            <h1 className="mt-3 h1">Gordon Odhiambo</h1>
            <p className="mt-2 text-lg font-medium text-accent">
              {siteConfig.person.title} · {siteConfig.person.tagline}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/85">{aboutBio.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(whatsappMessages.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" /> WhatsApp Gordon
              </a>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-light"
              >
                <Calendar className="h-5 w-5" /> Book a Showroom Visit
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            <SmartImage
              src={gordon}
              alt="Portrait of Gordon Odhiambo, interior solutions Sales Executive in Nairobi"
              className="h-full w-full"
              rounded
              priority
            />
          </div>
        </div>
      </section>

      {/* Full bio */}
      <section className="section bg-white">
        <div className="container-x max-w-3xl">
          <SectionHeading centered={false} eyebrow="My Story" title="A personal approach to premium interiors" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/80">
            {aboutBio.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <h3 className="mt-10 text-lg font-semibold text-navy">What I bring to every project</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {aboutBio.skills.map((s) => (
              <li key={s} className="flex items-center gap-2 rounded-card bg-sky px-4 py-3 text-sm font-medium text-navy">
                <Check className="h-5 w-5 text-accent" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process in detail */}
      <section className="section bg-navy text-white">
        <div className="container-x">
          <SectionHeading
            light
            eyebrow="How We'll Work Together"
            title="My five-step process, explained"
            intro="A clear, proven path that keeps you informed and in control from the very first message to the final handover."
          />
          <div className="mt-12">
            <ProcessSteps light />
          </div>
        </div>
      </section>

      {/* Showroom */}
      <section className="section bg-white">
        <div className="container-x grid items-stretch gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Visit the Showroom</p>
            <h2 className="mt-2 h2 text-navy">See and feel the quality in person</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Drop by the showroom to explore materials, finishes and hardware up close.
              Prefer to plan ahead? Book a visit and I&apos;ll make sure I&apos;m there to walk
              you through your options.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink/80">
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
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={siteConfig.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn-navy">
                <Calendar className="h-5 w-5" /> Book a Showroom Visit
              </a>
              <Link href="/contact/" className="btn-outline">
                Contact details
              </Link>
            </div>
          </div>
          <div className="min-h-[20rem] overflow-hidden rounded-card ring-1 ring-black/10">
            <iframe
              title="Gordon Sales Guru showroom, Aryan Centre, Mombasa Road, Nairobi"
              src={siteConfig.showroom.mapEmbed}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, minHeight: "20rem" }}
            />
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section className="section bg-sky">
        <div className="container-x max-w-2xl">
          <div className="rounded-card bg-white p-6 sm:p-8 ring-1 ring-black/5">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
