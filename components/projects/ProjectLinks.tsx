import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";

/**
 * Repository and demo links. A link with no URL is simply not shown, so a
 * project without public links renders nothing here. Fill in `repoUrl` /
 * `liveUrl` in lib/projects.ts and the buttons appear.
 */
export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  const links = [
    { label: "GitHub", href: project.repoUrl },
    { label: "Live demo", href: project.liveUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-body transition-colors duration-300 hover:border-line-strong hover:text-ink"
          >
            {link.label}
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
