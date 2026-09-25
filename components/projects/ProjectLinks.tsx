import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

/**
 * Repository and demo links. A link with no URL is simply not shown, so a
 * project without public links renders nothing here. Fill in `repoUrl` /
 * `liveUrl` in lib/projects.ts and the buttons appear.
 *
 * "Live demo" is the call to action: it comes first and is filled with the
 * accent colour; GitHub stays a quieter outlined button.
 */
export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  const links = [
    { label: "Live demo", href: project.liveUrl, primary: true },
    { label: "GitHub", href: project.repoUrl, primary: false },
  ].filter((link): link is { label: string; href: string; primary: boolean } => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/link inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-300 ${
              link.primary
                ? "border-accent bg-accent font-semibold text-canvas hover:border-accent-hover hover:bg-accent-hover"
                : "border-line font-medium text-body hover:border-line-strong hover:text-ink"
            }`}
          >
            {link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              strokeWidth={link.primary ? 2 : 1.5}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
