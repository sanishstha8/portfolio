import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { education, experience } from "@/lib/content";

export function Experience() {
  return (
    <Section id="experience" labelledBy="experience-heading" className="bg-panel">
      <SectionHeader id="experience-heading" eyebrow="Experience" title="Where I've worked" />

      {/* Timeline: a dot beside each role, joined by a rail down to the next one.
          Offsets line the dot up with the role title: card border (2px) +
          card padding (1.5rem, 2rem from sm) + half the title's line height. */}
      <RevealGroup className="mt-12 flex flex-col lg:mt-14">
        {experience.map((job, index) => (
          <RevealItem
            key={`${job.org}-${job.role}`}
            className="relative pb-6 pl-8 last:pb-0 sm:pl-12"
          >
            {index < experience.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-[calc(0.5rem-1px)] top-[calc(2.375rem+2px)] -bottom-[calc(2.375rem+2px)] w-0.5 bg-accent/35 sm:top-[calc(2.875rem+2px)] sm:-bottom-[calc(2.875rem+2px)]"
              />
            ) : null}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-[calc(1.875rem+2px)] h-4 w-4 rounded-full ring-4 ring-panel sm:top-[calc(2.375rem+2px)] ${
                job.current ? "bg-accent" : "border-2 border-accent bg-canvas"
              }`}
            />

            <article className="rounded-3xl border-2 border-line-strong bg-canvas p-6 shadow-[0_12px_32px_-20px_rgba(15,17,21,0.35)] sm:p-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
                {/* Role */}
                <div className="lg:col-span-4">
                  <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold text-ink">
                    {job.role}
                    {job.current ? (
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                        Current
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1.5 font-medium text-body">
                    {job.orgUrl ? (
                      <a
                        href={job.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/org inline-flex items-center gap-1 underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
                      >
                        {job.org}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/org:translate-x-0.5 group-hover/org:-translate-y-0.5"
                          strokeWidth={2}
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      job.org
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted">{job.period}</p>
                </div>

                {/* What I did */}
                <div className="lg:col-span-8">
                  <p className="body-lg text-body">{job.summary}</p>
                  <h4 className="mt-5 text-sm font-semibold text-ink">Projects</h4>
                  <ul className="mt-3 space-y-2.5">
                    {job.items.map((item) => (
                      <li key={item.label} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-3 text-[0.9375rem] text-body">
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {item.label}
                        </span>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="group/case inline-flex items-center gap-1 pl-4.5 text-sm font-semibold text-accent transition-colors duration-300 hover:text-accent-hover sm:pl-0"
                          >
                            View case study
                            <ArrowRight
                              aria-hidden="true"
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/case:translate-x-0.5"
                              strokeWidth={2}
                            />
                            <span className="sr-only">for {item.label}</span>
                          </Link>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-8 pl-8 sm:pl-12">
        <p className="text-[0.9375rem] text-body">
          <span className="font-semibold text-ink">Education:</span> {education.degree},{" "}
          {education.status.toLowerCase()}.
        </p>
      </Reveal>
    </Section>
  );
}
