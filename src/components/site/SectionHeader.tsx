import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  blurb,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-[Fraunces,serif] text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
        {title}
      </h2>
      {blurb && <p className="mt-4 text-base sm:text-lg text-muted-foreground">{blurb}</p>}
    </Reveal>
  );
}
