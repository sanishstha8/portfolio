import Link from "next/link";
import type { ReactNode } from "react";
import { isProtocolLink } from "@/lib/site";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export type ActionVariant = "primary" | "ghost" | "outline";
type Variant = ActionVariant;

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** `up-right` for outbound, `right` for in-page, `none` for plain. */
  icon?: "up-right" | "right" | "none";
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

const base =
  "group/action relative inline-flex items-center gap-3 px-6 py-4 mono-meta " +
  "transition-colors duration-300 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-canvas hover:bg-accent-hover focus-visible:outline-offset-4",
  ghost:
    "border border-line text-ink hover:border-line-strong hover:bg-black/[0.035]",
  /** Hard-outlined pill used in the hero: fills in on hover. */
  outline:
    "border-2 border-ink text-ink hover:bg-ink hover:text-canvas",
};

/**
 * Same treatment for real `<button>` elements, so the contact form's submit
 * matches every link on the site without duplicating the class list.
 */
export function actionClasses(variant: Variant = "ghost", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

/**
 * The site's one link/button treatment. Squared corners, mono label, and a
 * single moving part: the icon nudges on hover.
 */
export function ActionLink({
  href,
  children,
  variant = "ghost",
  icon = "none",
  external = false,
  className = "",
  ariaLabel,
}: ActionLinkProps) {
  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon === "up-right" ? (
        <ArrowUpRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5"
          strokeWidth={1.5}
        />
      ) : null}
      {icon === "right" ? (
        <ArrowRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/action:translate-x-1"
          strokeWidth={1.5}
        />
      ) : null}
    </>
  );

  const classes = actionClasses(variant, className);

  /* mailto:/tel: hand off to the OS, so they get a plain anchor: next/link
     would try to route them, and target="_blank" would orphan a tab. */
  const isProtocol = isProtocolLink(href);

  if (external || isProtocol) {
    return (
      <a
        href={href}
        {...(external && !isProtocol
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={classes}
        aria-label={ariaLabel}
        data-cursor="expand"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} data-cursor="expand">
      {content}
    </Link>
  );
}
