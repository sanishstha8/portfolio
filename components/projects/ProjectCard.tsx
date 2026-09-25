import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { ProjectVisual } from "./ProjectVisual";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectLinks } from "./ProjectLinks";
import { Reveal } from "@/components/ui/Reveal";

type ProjectCardProps = {
  project: Project;
  /** Even-indexed cards put the visual on the left; odd ones flip it. */
  flipped?: boolean;
};

/** One project on the home page: a preview, a plain description and a link to the write-up. */
export function ProjectCard({ project, flipped = false }: ProjectCardProps) {
  const href = `/work/${project.slug}`;

  return (
    <Reveal as="article" className="group/project rounded-3xl border-2 border-line-strong bg-canvas p-5 shadow-[0_12px_32px_-20px_rgba(15,17,21,0.35)] transition-colors duration-300 hover:border-accent sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Visual */}
        <div className={`lg:col-span-7 ${flipped ? "lg:order-2" : "lg:order-1"}`}>
          {/* Screenshots swipe in place; only the drawn mockup links through. */}
          {project.screenshots && project.screenshots.length > 0 ? (
            <div className="overflow-hidden rounded-xl">
              <ProjectGallery
                images={project.screenshots}
                title={project.titleLines[0]}
                priority={false}
              />
            </div>
          ) : project.visual ? (
            <Link
              href={href}
              tabIndex={-1}
              aria-hidden="true"
              className="block overflow-hidden rounded-xl transition-transform duration-500 group-hover/project:-translate-y-1"
            >
              <ProjectVisual visual={project.visual} />
            </Link>
          ) : null}
        </div>

        {/* Text */}
        <div className={`flex flex-col lg:col-span-5 ${flipped ? "lg:order-1" : "lg:order-2"}`}>
          <p className="text-sm text-muted">
            {project.category} · {project.year}
          </p>
          <h3 className="section-title mt-2 text-ink">
            <Link href={href} className="transition-colors duration-300 hover:text-accent">
              {project.title}
            </Link>
          </h3>

          <p className="body-lg mt-4 text-body">{project.summary}</p>

          <ul className="mt-6 space-y-3">
            {project.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight.label} className="flex gap-3 text-[0.9375rem] leading-relaxed text-body">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <span className="font-semibold text-ink">{highlight.label}.</span>{" "}
                  {highlight.detail}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li key={item} className="rounded-full bg-shade px-3 py-1 text-sm text-body">
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm text-muted">{project.status}</p>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={href}
              className="inline-flex items-center gap-2 font-semibold text-accent transition-colors duration-300 hover:text-accent-hover"
            >
              Read the case study
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover/project:translate-x-1"
                strokeWidth={2}
              />
              <span className="sr-only">for {project.title}</span>
            </Link>
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
