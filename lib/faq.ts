/**
 * Content for the "Ask Me" widget — a rule-based FAQ bot, not an AI model.
 * Every answer is derived from the same data the rest of the site reads
 * (`lib/site.ts`, `lib/projects.ts`, `lib/content.ts`), so it can't drift out
 * of sync: edit a project or the stack list once, and the bot's answers
 * update with it.
 */

import { resumeUrl, site } from "./site";
import { projects } from "./projects";
import { coreStack, education, experience, moreStack } from "./content";

export type FaqEntry = {
  id: string;
  /** Shown as the chip label and as the "asked" line in the transcript. */
  question: string;
  answer: string;
  /** Lowercase words/phrases that trigger this entry from free-text input. */
  keywords: string[];
};

const stackSummary = `mainly ${coreStack.map((tech) => tech.name).join(", ")}. I've also worked with ${moreStack.join(", ")}`;

const projectEntries: FaqEntry[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  question: `Tell me about ${project.titleLines[0]}`,
  answer: `${project.summary} Built with ${project.tech.join(", ")}. ${project.status}`,
  keywords: [
    project.titleLines[0].toLowerCase(),
    project.slug.replace(/-/g, " "),
    ...project.tech.map((t) => t.toLowerCase()),
  ],
}));

export const faqEntries: FaqEntry[] = [
  {
    id: "stack",
    question: "What's your tech stack?",
    answer: `I work ${stackSummary}.`,
    keywords: ["stack", "tech", "technology", "language", "languages", "framework", "tools", "know"],
  },
  ...projectEntries,
  {
    id: "availability",
    question: "Are you open to work?",
    answer:
      "Yes, I'm open to new development opportunities.",
    keywords: ["available", "availability", "hire", "hiring", "job", "work", "open", "opportunit"],
  },
  {
    id: "experience",
    question: "Where do you work?",
    answer: `${experience
      .map((job) => `${job.role}, ${job.org} (${job.period}): ${job.items.map((item) => item.label).join(", ")}`)
      .join(". ")}.`,
    keywords: ["where do you work", "experience", "intern", "company", "brandbuilder", "employ", "freelance", "client"],
  },
  {
    id: "contact",
    question: "How can I contact you?",
    answer: `The fastest way is email: ${site.email}, or call or WhatsApp me on ${site.phone}. You'll also find my GitHub and LinkedIn in the contact section below, or just use the "Send a message" button.`,
    keywords: ["contact", "email", "reach", "message", "touch", "linkedin", "github", "phone", "call", "number", "whatsapp"],
  },
  {
    id: "background",
    question: "What's your background?",
    answer: `I'm a ${site.education} student based in ${site.location}, focused on backend and full-stack development: Python, Django, REST APIs and the databases underneath them. I'm currently a ${experience[0].role} at ${experience[0].org} (${education.degree}, ${education.status.toLowerCase()}).`,
    keywords: ["background", "about", "who", "education", "student", "based", "location", "nepal", "csit", "study", "studying"],
  },
  {
    id: "resume",
    question: "Do you have a resume?",
    answer: resumeUrl
      ? "Yes, there's a RESUME button in the hero section at the top of the page."
      : "Not published on the site yet. Email me and I'll send it over directly.",
    keywords: ["resume", "cv", "curriculum"],
  },
  {
    id: "site-build",
    question: "What was this site built with?",
    answer:
      "Next.js, TypeScript, Tailwind CSS and Framer Motion. Hand-coded, not a template or page builder.",
    keywords: ["website", "site", "built", "build", "made", "framework", "next.js", "nextjs", "code", "coded"],
  },
];

/**
 * Scores every entry by how many of its keywords appear in the query and
 * returns the best match. Returns `null` when nothing scores above zero,
 * so the caller can show an honest "I don't have an answer for that" state
 * instead of guessing.
 */
export function matchFaq(query: string): FaqEntry | null {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return null;

  let best: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of faqEntries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        score += keyword.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return best;
}
