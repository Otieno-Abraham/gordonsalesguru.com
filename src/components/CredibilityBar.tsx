import { siteConfig } from "@/lib/config";

/** Credibility stats bar used on the hero. Server component. */
export default function CredibilityBar({ light = true }: { light?: boolean }) {
  return (
    <dl
      className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${
        light ? "text-white" : "text-navy"
      }`}
    >
      {siteConfig.stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-card px-4 py-4 text-center ${
            light ? "bg-white/5 ring-1 ring-white/10" : "bg-sky"
          }`}
        >
          <dd className="text-2xl font-semibold sm:text-3xl">{s.value}</dd>
          <dt className={`mt-1 text-xs ${light ? "text-white/70" : "text-ink/60"}`}>
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
