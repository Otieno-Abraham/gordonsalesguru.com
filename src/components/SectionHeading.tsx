/** Consistent section heading with optional eyebrow + intro. Server component. */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  centered = true,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  light?: boolean;
  centered?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <As
        className={`mt-2 ${As === "h1" ? "h1" : "h2"} ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </As>
      {intro && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/75" : "text-ink/70"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
