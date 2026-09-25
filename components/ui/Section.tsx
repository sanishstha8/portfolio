import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Vertical rhythm. `tight` is used for short interstitial modules. */
  spacing?: "default" | "tight";
  labelledBy?: string;
};

export function Section({
  id,
  children,
  className = "",
  spacing = "default",
  labelledBy,
}: SectionProps) {
  const padding =
    spacing === "tight"
      ? "py-16 md:py-20 lg:py-24"
      : "py-20 md:py-24 lg:py-28";

  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative ${className}`}>
      <div className={`shell ${padding}`}>{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
};

/** Plain section opener: a short eyebrow, a sentence-case title and an optional intro. */
export function SectionHeader({ id, eyebrow, title, intro, className = "" }: SectionHeaderProps) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title mt-3 text-ink">
        {title}
      </h2>
      {intro ? <p className="body-lg mt-5 text-body">{intro}</p> : null}
    </Reveal>
  );
}

type SectionMarkerProps = {
  label: string;
  className?: string;
};

/** The repeating editorial header: a mono section label above a hairline rule. */
export function SectionMarker({ label, className = "" }: SectionMarkerProps) {
  return (
    <div className={`border-b border-line pb-4 ${className}`}>
      <span className="mono-meta text-muted">{label}</span>
    </div>
  );
}
