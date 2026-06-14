import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ProjectGallery from "@/components/ProjectGallery";
import LeadForm from "@/components/LeadForm";
import SectionHeading from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";
import { buildMetadata, pageTitle, breadcrumbSchema } from "@/lib/seo";
import { getProjects } from "@/lib/media";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Completed Interior Projects Across East Africa"),
  description:
    "See completed kitchen, wardrobe, bathroom and interior fitout projects delivered by Gordon Odhiambo across Nairobi, Kenya and East Africa. Get a similar result for your space.",
  path: "/projects",
  keywords: [
    "interior fitouts Nairobi",
    "completed kitchen projects Kenya",
    "wardrobe installation Nairobi",
    "interior design contractor Nairobi",
  ],
});

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />

      <section className="hero-texture text-white">
        <div className="container-x py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Portfolio</p>
            <h1 className="mt-3 h1">Completed Projects Across East Africa</h1>
            <p className="mt-5 text-lg text-white/80">
              Real installations for homeowners, developers and businesses — kitchens,
              wardrobes, bathrooms and full interior fitouts, delivered end to end.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x">
          <ProjectGallery projects={projects} />
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-navy text-white">
        <div className="container-x text-center">
          <h2 className="h2">Want a similar result for your space? Let&apos;s talk.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Tell Gordon what you have in mind and he&apos;ll show you how to make it happen —
            from first sketch to final installation.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={whatsappLink(whatsappMessages.consultation)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp Gordon Now
            </a>
          </div>
        </div>
      </section>

      <section className="section bg-sky">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Start your project</p>
            <h2 className="mt-2 h2 text-navy">Tell Gordon about your space</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              Whether it&apos;s a single statement kitchen or a multi-room fitout, the process
              starts with a simple conversation. Browse the{" "}
              <Link href="/products/" className="font-semibold text-blue hover:underline">
                full product range
              </Link>{" "}
              or learn more{" "}
              <Link href="/about/" className="font-semibold text-blue hover:underline">
                about Gordon
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
