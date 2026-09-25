/** Structured copy for the experience, stack and toolkit modules. */

export type ExperienceEntry = {
  role: string;
  org: string;
  /** Company website, opened in a new tab. */
  orgUrl?: string;
  period: string;
  /** Still in this role: shows a "Current" tag. */
  current?: boolean;
  summary: string;
  /** Work done in the role. `href` points at a case study when one exists. */
  items: { label: string; href?: string }[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Full-Stack Developer Intern",
    org: "BrandBuilder",
    orgUrl: "https://brandbuilder.com.np/",
    period: "2026 to present",
    current: true,
    summary: "Building WordPress products and web tools as part of the development team.",
    items: [
      { label: "ReBuzz Backup & Restore", href: "/work/rebuzz-backup-restore" },
      { label: "Landing page for a WordPress plugin" },
      { label: "Bulk WhatsApp Messaging System" },
    ],
  },
  {
    role: "Freelance Developer",
    org: "Client project",
    period: "2026",
    summary: "Designed and built an online store for a clothing shop in Nepal.",
    items: [{ label: "mimi.clo online clothing store", href: "/work/mimiclo" }],
  },
];

export const education = { degree: "BSc CSIT", status: "Expected 2027" };

/** The technologies I reach for most, shown as large tiles. */
export const coreStack: { name: string; role: string }[] = [
  { name: "TypeScript", role: "" },
  { name: "React", role: "" },
  { name: "Next.js", role: "" },
  { name: "Python", role: "" },
  { name: "Django", role: "" },
  { name: "PostgreSQL", role: "" },
  { name: "Supabase", role: "Backend service" },
  { name: "Git", role: "Version control" },
];

/** Everything else I have written code with, shown as small tags. */
export const moreStack: string[] = [
  "JavaScript",
  "Django REST Framework",
  "REST APIs",
  "Tailwind CSS",
  "SQLite",
  "Vercel",
  "HTML",
  "CSS",
  "PHP",
  "WordPress",
  "Java",
  "C",
  "C++",
  "GitHub",
  "VS Code",
];

/**
 * Decorative signal bars for the floating toolkit panel.
 * `weight` is a visual emphasis value for where my day-to-day work sits —
 * it is not a measured or self-assessed skill percentage, and the component
 * labels itself accordingly.
 */
export type ToolkitSignal = {
  label: string;
  weight: number;
};

export const toolkitSignals: ToolkitSignal[] = [
  { label: "PYTHON", weight: 10 },
  { label: "DJANGO", weight: 9 },
  { label: "APIS", weight: 8 },
  { label: "DATABASE", weight: 8 },
];

export const TOOLKIT_SCALE = 10;

/** Facts panel in the about section. */
export const aboutFacts = [
  { label: "Based in", value: "Pokhara, Nepal" },
  { label: "Focus", value: "Backend and full-stack" },
  { label: "Studying", value: "BSc CSIT" },
];

/** Node labels for the hero system diagram. */
export const heroSystemNodes = [
  { label: "REACT", role: "FRAMEWORK" },
  { label: "NEXT.JS", role: "INTERFACE" },
  { label: "TYPESCRIPT", role: "LANGUAGE" },
  { label: "PYTHON", role: "PERSISTENCE" },
  { label: "DJANGO", role: "VERSION CONTROL" },
  { label: "GIT", role: "LANGUAGE" },
];
