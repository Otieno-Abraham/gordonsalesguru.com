import SmartImage from "./SmartImage";
import { MapPin } from "./Icons";
import type { Project } from "@/lib/media";

/** Presentational project card. Used inside the client-side ProjectGallery. */
export default function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="card group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={`View ${project.name}`}
    >
      <div className="relative aspect-[4/3]">
        <SmartImage
          src={project.src}
          alt={project.alt}
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-300"
        />
        <span className="badge absolute left-3 top-3 bg-white/90">{project.type}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-navy">{project.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
          <MapPin className="h-4 w-4 text-accent" />
          {project.location}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
          {project.description}
        </p>
      </div>
    </button>
  );
}
