import { Section, SectionHeader } from "@/components/ui/Section";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/lib/projects";

export function Work() {
  return (
    <Section id="work" labelledBy="work-heading">
      <SectionHeader
        id="work-heading"
        eyebrow="Projects"
        title="Things I have built"
        intro="Three projects I took from an empty repository to a working system. Each one is written up as a case study: the problem, the shape of the data, and what I would do differently."
      />

      <div className="mt-14 flex flex-col gap-12 lg:mt-16 lg:gap-16">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} flipped={index % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
