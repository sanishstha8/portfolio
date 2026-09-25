import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { getNextProject, getProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { Reveal } from "@/components/ui/Reveal";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} · ${site.name}`,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · ${site.name}`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getNextProject(project.slug);

  return (
    <article>
      {/* ------------------------------------------------ header */}
      <header className="shell pb-12 pt-32 sm:pt-36 md:pt-40 lg:pb-16 lg:pt-44">
        <Link
          href="/#work"
          className="group/back inline-flex items-center gap-2 text-[0.9375rem] font-medium text-muted transition-colors duration-300 hover:text-ink"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover/back:-translate-x-1"
            strokeWidth={2}
          />
          All projects
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="text-sm text-muted">
              {project.category} · {project.year}
            </p>
            <h1 className="section-title mt-3 text-ink lg:text-[3rem] lg:leading-[1.15]">
              {project.titleLines[0]}
              <span className="block text-muted">{project.titleLines[1]}</span>
            </h1>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:pt-8" delay={0.06}>
            <p className="body-lg text-body">{project.intro}</p>
            <ProjectLinks project={project} className="mt-6" />
          </Reveal>
        </div>
      </header>

      {/* ------------------------------------------------ visual */}
      <div className="shell pb-16 lg:pb-24">
        <Reveal className="mx-auto w-full max-w-4xl">
          {project.screenshots && project.screenshots.length > 0 ? (
            <ProjectGallery images={project.screenshots} title={project.titleLines[0]} />
          ) : project.visual ? (
            <ProjectVisual visual={project.visual} interactive />
          ) : null}
        </Reveal>
      </div>

      {/* ------------------------------------------------ body */}
      <div className="bg-panel">
        <div className="shell py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Narrative */}
            <div className="flex flex-col gap-12 lg:col-span-7">
              {project.sections.map((section) => (
                <Reveal key={section.heading} as="section">
                  <h2 className="text-2xl font-semibold tracking-tight text-ink">
                    {section.heading}
                  </h2>
                  <p className="mt-4 max-w-prose text-[1.0625rem] leading-[1.8] text-body lg:text-lg">
                    {section.body}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Details */}
            <aside className="lg:col-span-5">
              <div className="rounded-2xl border border-line-soft bg-canvas p-6 sm:p-8 lg:sticky lg:top-28">
                <h2 className="text-base font-semibold text-ink">Built with</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <li key={item} className="rounded-full bg-shade px-3 py-1 text-sm text-body">
                      {item}
                    </li>
                  ))}
                </ul>

                <h2 className="mt-8 text-base font-semibold text-ink">Key features</h2>
                <ul className="mt-3 space-y-4">
                  {project.highlights.map((highlight) => (
                    <li key={highlight.label} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-[0.9375rem] leading-relaxed text-body">
                        <span className="font-semibold text-ink">{highlight.label}.</span>{" "}
                        {highlight.detail}
                      </span>
                    </li>
                  ))}
                </ul>

                <h2 className="mt-8 text-base font-semibold text-ink">Status</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-body">{project.status}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ next */}
      <nav aria-label="Next project" className="border-t border-line-soft">
        <div className="shell">
          <Link
            href={`/work/${next.slug}`}
            className="group/next flex items-center justify-between gap-6 py-14 lg:py-20"
          >
            <div>
              <span className="text-sm font-medium text-muted">Next project</span>
              <p className="section-title mt-2 text-ink transition-colors duration-300 group-hover/next:text-accent">
                {next.title}
              </p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="h-7 w-7 shrink-0 text-faint transition-transform duration-300 group-hover/next:translate-x-2 group-hover/next:text-accent"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </nav>
    </article>
  );
}
