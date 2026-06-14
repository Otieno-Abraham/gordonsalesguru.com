"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import Lightbox, { type LightboxItem } from "./Lightbox";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink, whatsappMessages } from "@/lib/config";
import type { Project } from "@/lib/media";

const FILTERS: { key: string; label: string; match: (p: Project) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "kitchens", label: "Kitchen", match: (p) => p.category === "kitchens" },
  { key: "wardrobes", label: "Wardrobe", match: (p) => p.category === "wardrobes" },
  { key: "bathrooms", label: "Bathroom", match: (p) => p.category === "bathrooms" },
  {
    key: "fitouts",
    label: "Interior Fitout",
    match: (p) => p.category === "fitouts" || p.category === "general",
  },
];

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const f = FILTERS.find((x) => x.key === filter) ?? FILTERS[0];
    return projects.filter(f.match);
  }, [projects, filter]);

  const items: LightboxItem[] = filtered.map((p) => ({
    src: p.src,
    alt: p.alt,
    caption: `${p.name} — ${p.location}`,
  }));

  if (projects.length === 0) {
    return (
      <div className="rounded-card bg-sky p-12 text-center">
        <h3 className="text-lg font-semibold text-navy">
          Project photos coming soon
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
          Completed project photography is added regularly. Message Gordon to see
          recent installations and discuss your own project.
        </p>
        <a
          href={whatsappLink(whatsappMessages.consultation)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-5"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Talk to Gordon
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
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
          No projects in this category yet — but more are added regularly.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} onOpen={() => setLightbox(i)} />
          ))}
        </div>
      )}

      <Lightbox
        items={items}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </div>
  );
}
