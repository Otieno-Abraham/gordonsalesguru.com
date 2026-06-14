import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SmartImage from "@/components/SmartImage";
import CategoryCard from "@/components/CategoryCard";
import CredibilityBar from "@/components/CredibilityBar";
import ProcessSteps from "@/components/ProcessSteps";
import TestimonialCard from "@/components/TestimonialCard";
import BlogCard from "@/components/BlogCard";
import FAQ from "@/components/FAQ";
import LeadForm from "@/components/LeadForm";
import LeadModalButton from "@/components/LeadModalButton";
import SectionHeading from "@/components/SectionHeading";
import { WhatsAppIcon, ArrowRight, Handshake, Clock, Shield, MapPin } from "@/components/Icons";
import { siteConfig, productCategories, whatsappLink, whatsappMessages } from "@/lib/config";
import { buildMetadata, pageTitle, personSchema, localBusinessSchema, faqSchema } from "@/lib/seo";
import {
  getCategoryCover,
  getProductCategoryCounts,
  getProjects,
  getGordonPhoto,
} from "@/lib/media";
import { getRecentPosts } from "@/lib/posts";
import { homepageFaqs, whyChoose, testimonials, aboutBio } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Custom Kitchen Cabinets, Wardrobes & Interior Fitouts"),
  description:
    "Premium custom kitchen cabinets, wardrobes, bathrooms and interior fitouts across East Africa. Work directly with Gordon Odhiambo — free consultation, on-time delivery.",
  path: "/",
  keywords: [
    "kitchen cabinets Nairobi",
    "custom kitchen cabinets Kenya",
    "wardrobes Nairobi",
    "interior fitouts Nairobi",
    "Gordon Odhiambo",
  ],
});

const iconMap = { handshake: Handshake, clock: Clock, shield: Shield };

export default function HomePage() {
  const counts = getProductCategoryCounts();
  const featuredProjects = getProjects().slice(0, 3);
  const recentPosts = getRecentPosts(3);
  const gordon = getGordonPhoto();

  return (
    <>
      <JsonLd data={[personSchema(), localBusinessSchema(), faqSchema(homepageFaqs)]} />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="hero-texture relative overflow-hidden text-white">
        <div className="container-x py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow text-accent">Your Interior Solutions Expert · East Africa</p>
            <h1 className="mt-3 h1">
              Premium Kitchens, Wardrobes &amp; Interiors — Delivered Across East Africa
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              I&apos;m Gordon Odhiambo, your personal interior solutions expert. From first
              consultation to final installation — I handle everything.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(whatsappMessages.default)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp Gordon Now
              </a>
              <LeadModalButton label="Request a Quote" variant="outline-light" />
            </div>
          </div>
          <div className="mt-14">
            <CredibilityBar />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Product categories */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="What I Offer"
            title="Custom interiors for every room"
            intro="Explore the ranges I design, supply and install — each one made to measure for your space and finished to a premium standard."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((c) => (
              <CategoryCard
                key={c.key}
                name={c.name}
                blurb={c.blurb}
                href={c.href}
                cover={getCategoryCover(c.key)}
                count={counts[c.key]}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products/" className="btn-navy">
              View All Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- About snapshot */}
      <section className="section bg-sky">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            <SmartImage
              src={gordon}
              alt="Gordon Odhiambo, Sales Executive and interior solutions expert in Nairobi"
              className="h-full w-full"
              rounded
              priority
            />
          </div>
          <div>
            <p className="eyebrow">Meet Gordon</p>
            <h2 className="mt-2 h2 text-navy">{siteConfig.person.tagline}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">{aboutBio.intro}</p>
            <p className="mt-3 text-base leading-relaxed text-ink/75">{aboutBio.paragraphs[1]}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about/" className="btn-navy">
                Learn more about Gordon
              </Link>
              <Link href="/projects/" className="btn-outline">
                See completed projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Featured projects */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading
            eyebrow="Recent Work"
            title="Featured completed projects"
            intro="A glimpse of installations delivered for clients across Kenya and East Africa."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((p) => (
                <Link key={p.id} href="/projects/" className="card group flex flex-col">
                  <div className="relative aspect-[4/3]">
                    <SmartImage src={p.src} alt={p.alt} className="h-full w-full" imgClassName="group-hover:scale-105 transition-transform duration-300" />
                    <span className="badge absolute left-3 top-3 bg-white/90">{p.type}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-navy">{p.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
                      <MapPin className="h-4 w-4 text-accent" /> {p.location}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-ink/60">Project photos coming soon.</p>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link href="/projects/" className="btn-outline">
              View All Projects <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- The process */}
      <section className="section bg-navy text-white">
        <div className="container-x">
          <SectionHeading
            light
            eyebrow="How It Works"
            title="The Gordon process — from enquiry to handover"
            intro="One expert, one clear path. Here's exactly how we'll bring your project to life."
          />
          <div className="mt-12">
            <ProcessSteps light />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Why choose */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Why Gordon" title="Why clients choose to work with me" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whyChoose.map((w) => {
              const Icon = iconMap[w.icon];
              return (
                <div key={w.title} className="rounded-card bg-sky p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-pill bg-navy text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Testimonials */}
      <section className="section bg-sky">
        <div className="container-x">
          <SectionHeading eyebrow="Client Words" title="Trusted by homeowners and developers" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Latest blog */}
      {recentPosts.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                centered={false}
                eyebrow="From the Blog"
                title="Ideas, guides &amp; inspiration"
              />
              <Link href="/blog/" className="btn-outline">
                All articles <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------------- FAQ */}
      <section className="section bg-sky">
        <div className="container-x">
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked questions"
            intro="Everything you need to know before starting your project. Still unsure? Just ask Gordon on WhatsApp."
          />
          <div className="mt-12">
            <FAQ items={homepageFaqs} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Lead form */}
      <section id="consultation" className="section bg-white">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Let&apos;s Talk</p>
            <h2 className="mt-2 h2 text-navy">Start your project today</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Tell me about your space and I&apos;ll get back to you within two hours during
              business hours. No pressure, no obligation — just expert advice and a clear
              plan for your kitchen, wardrobe, bathroom or full fitout.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" /> {siteConfig.showroom.full}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" /> {siteConfig.hours.weekdays} · {siteConfig.hours.saturday}
              </li>
            </ul>
            <a
              href={whatsappLink(whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-6"
            >
              <WhatsAppIcon className="h-5 w-5" /> Prefer WhatsApp? Message Gordon
            </a>
          </div>
          <div className="rounded-card bg-sky p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
