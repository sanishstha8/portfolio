/**
 * Single source of truth for identity, links and copy that repeats across
 * the site. Anything marked `isPlaceholder` is waiting on a real value —
 * the UI renders those slots as visibly pending rather than inventing a URL.
 */

/** Which brand mark the social row draws for a channel. */
export type ChannelIcon = "github" | "linkedin" | "mail";

export type ContactChannel = {
  label: string;
  /** Display string shown to the reader. */
  value: string;
  href: string | null;
  isPlaceholder: boolean;
  icon: ChannelIcon;
};

/**
 * Hero portrait. Drop an image in `public/` and point this at it, e.g.
 * `{ src: "/sanish.jpg", alt: "Sanish Shrestha" }`. While it is `null` the
 * hero renders a labelled empty frame instead of a broken image.
 */
export const heroPhoto: { src: string; alt: string } | null = {
  src: "/sanish3.jpeg",
  alt: "Sanish Shrestha",
};

/**
 * CV download. Put the PDF in `public/` and set this to its path, e.g.
 * `"/sanish-shrestha-cv.pdf"`. While it is `null` the RESUME button renders
 * as visibly pending rather than linking to a 404.
 */
export const resumeUrl: string | null = null;

export const site = {
  name: "Sanish Shrestha",
  shortName: "SANISH.DEV",
  role: "Python / Django Developer",
  secondaryRoles: ["Backend & API Development", "Full-Stack Developer", "Modern Frontend Development", "Database & Deployment"],
  education: "BSc CSIT",
  location: "Nepal",
  availability: "AVAILABLE",
  /**
   * Canonical origin. Placeholder domain — override with NEXT_PUBLIC_SITE_URL
   * at build time, or edit this line once the real domain is live. Used for
   * canonical URLs, Open Graph image resolution and the sitemap.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sanishshrestha.dev",
  description:
    "Sanish Shrestha is a Python and Django developer building practical web applications, backend systems and REST APIs.",
  githubUrl: "https://github.com/sanishstha8",
  githubHandle: "sanishstha8",
  linkedinUrl: "https://www.linkedin.com/in/sanish-shrestha-3843442a8",
  email: "xthasanish44@gmail.com",
} as const;

/**
 * `mailto:` and `tel:` links open the OS handler, so they must never carry
 * target="_blank" — that leaves an orphaned blank tab behind.
 */
export function isProtocolLink(href: string): boolean {
  return /^(mailto:|tel:)/i.test(href);
}

export const contactChannels: ContactChannel[] = [
  {
    label: "GITHUB",
    value: "github.com/sanishstha8",
    href: site.githubUrl,
    isPlaceholder: false,
    icon: "github",
  },
  {
    label: "LINKEDIN",
    value: "linkedin.com/in/sanish-shrestha-3843442a8",
    href: site.linkedinUrl,
    isPlaceholder: false,
    icon: "linkedin",
  },
  {
    label: "EMAIL",
    value: site.email,
    href: `mailto:${site.email}`,
    isPlaceholder: false,
    icon: "mail",
  },
];

/** Roles cycled by the hero typewriter. */
export const typewriterRoles: string[] = [site.role, ...site.secondaryRoles];

export const navLinks = [
  { label: "ABOUT", href: "/#about", id: "about" },
  { label: "EXPERIENCE", href: "/#experience", id: "experience" },
  { label: "WORK", href: "/#work", id: "work" },
  { label: "STACK", href: "/#stack", id: "stack" },
  { label: "CONTACT", href: "/#contact", id: "contact" },
] as const;
