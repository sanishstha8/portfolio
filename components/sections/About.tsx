import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { aboutFacts } from "@/lib/content";
import { site } from "@/lib/site";

export function About() {
  return (
    <Section id="about" labelledBy="about-heading">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeader
            id="about-heading"
            eyebrow="About me"
            title="I like turning ideas into working systems."
          />

          <Reveal className="body-lg mt-8 max-w-2xl space-y-5 text-justify text-body hyphens-auto lg:text-left lg:hyphens-manual">
            <p>
              I am a BSc CSIT student based in Nepal, working mostly on the
              backend: Python and Django, REST APIs, and the databases
              underneath them.
            </p>
            <p>
              The part I enjoy most happens before the code: deciding how the
              data should be shaped, what the system has to guarantee, and where
              the edges are. When that is clear, the implementation tends to
              follow.
            </p>
            <p>
              I am early in my career and would rather say so plainly than pad
              it. Right now I am a Full-Stack Developer Intern at BrandBuilder,
              and I also take on client work. What I can point to is working
              software: a WordPress backup and restore plugin, a full-stack
              restaurant management system built on Django and PostgreSQL, and
              an online clothing store for a client, built with Next.js and
              Supabase.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:pt-10" delay={0.08}>
          <div className="rounded-2xl border border-line-strong bg-panel p-6 sm:p-8">
            <dl className="space-y-4">
              {aboutFacts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-line-soft pb-4 last:border-b-0 last:pb-0">
                  <dt className="text-[0.9375rem] text-muted">{fact.label}</dt>
                  <dd className="text-right text-[0.9375rem] font-medium text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-8 text-base font-semibold text-ink">What I do</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.secondaryRoles.map((role) => (
                <li
                  key={role}
                  className="rounded-full border border-line bg-canvas px-3.5 py-1.5 text-sm text-body"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

