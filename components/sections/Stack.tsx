import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { coreStack, moreStack } from "@/lib/content";

export function Stack() {
  return (
    <Section id="stack" labelledBy="stack-heading" className="bg-panel">
      <SectionHeader
        id="stack-heading"
        eyebrow="Skills"
        title="The tools I use"
        intro="The eight technologies I reach for most, and the rest I have written real code with."
      />

      {/* Core: the eight that matter most, as large tiles */}
      <h3 className="mt-12 text-base font-semibold text-ink lg:mt-14">Core technologies</h3>
      <RevealGroup as="ul" className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {coreStack.map((tech) => (
          <RevealItem
            as="li"
            key={tech.name}
            className="rounded-2xl bg-canvas px-5 py-5 sm:px-6 sm:py-6"
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <span className="text-lg font-semibold text-ink sm:text-xl">{tech.name}</span>
            </span>
            <span className="mt-1.5 block pl-[1.125rem] text-sm text-muted">{tech.role}</span>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Everything else, as small tags */}
      <Reveal className="mt-10 lg:mt-12">
        <h3 className="text-base font-semibold text-ink">More technologies</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {moreStack.map((item) => (
            <li
              key={item}
              className="rounded-full border border-line bg-canvas px-3.5 py-1.5 text-sm text-body"
            >
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
