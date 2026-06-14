import { processSteps } from "@/lib/data";

/** The 5-step Gordon process. Server component. */
export default function ProcessSteps({ light = false }: { light?: boolean }) {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {processSteps.map((step) => (
        <li
          key={step.number}
          className={`relative rounded-card p-5 ${
            light ? "bg-white/5 ring-1 ring-white/10" : "bg-sky"
          }`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-pill text-sm font-semibold ${
              light ? "bg-accent text-white" : "bg-navy text-white"
            }`}
          >
            {step.number}
          </span>
          <h3 className={`mt-4 text-base font-semibold ${light ? "text-white" : "text-navy"}`}>
            {step.title}
          </h3>
          <p className={`mt-1.5 text-sm leading-relaxed ${light ? "text-white/70" : "text-ink/70"}`}>
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
