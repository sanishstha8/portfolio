/**
 * Project case studies.
 *
 * `repoUrl` / `liveUrl` are intentionally `null` where no public URL has been
 * supplied yet. The UI simply leaves those buttons out rather than pointing
 * at a placeholder that would 404. Fill them in and the buttons appear
 * automatically.
 */

export type ProjectVisual = "rebuzz" | "feastio";

export type CaseStudySection = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  /** Two-digit index used as editorial furniture throughout the site. */
  number: string;
  /** Title is split across lines so the editorial layout can control breaks. */
  titleLines: [string, string];
  /** Flat title for <title>, aria-labels and metadata. */
  title: string;
  category: string;
  year: string;
  /** Short line used on the index. */
  summary: string;
  /** Longer intro used at the top of the case study. */
  intro: string;
  tech: string[];
  /** Factual delivery state — never claims approval or adoption. */
  status: string;
  highlights: { label: string; detail: string }[];
  sections: CaseStudySection[];
  /** Drawn mockup, used only when a project has no `screenshots`. */
  visual?: ProjectVisual;
  repoUrl: string | null;
  liveUrl: string | null;
  /**
   * Real product screenshots, in display order — paths into `public/`, e.g.
   * `["/screenshots/feastio-1.png", ...]`. Omitted or empty renders the
   * drawn conceptual mockup (`ProjectVisual`) instead of a swipeable gallery;
   * add real files and this array to switch a project over, no other code
   * changes needed.
   */
  screenshots?: string[];
};

export const projects: Project[] = [
  {
    slug: "rebuzz-backup-restore",
    number: "01",
    titleLines: ["ReBuzz", "Backup & Restore"],
    title: "ReBuzz Backup & Restore",
    category: "WordPress plugin",
    year: "2026",
    summary: "A professional backup and restore system for WordPress websites.",
    intro:
      "ReBuzz Backup & Restore is a WordPress plugin that gives site owners a dependable way to capture a full snapshot of a site (files and database together) and put it back when something breaks. It was built around the parts of WordPress backup tooling that tend to fail quietly: partial archives, exports that time out on shared hosting, and restores that leave a site half-migrated.",
    tech: ["PHP", "WordPress", "JavaScript"],
    status: "Built during my internship at BrandBuilder. Prepared for WordPress.org plugin review.",
    highlights: [
      {
        label: "Full-site snapshots",
        detail:
          "Files and database captured together, so a restore returns a site to one coherent state.",
      },
      {
        label: "Chunked processing",
        detail:
          "Work is split into resumable batches so large sites survive shared-hosting execution limits.",
      },
      {
        label: "Guided restore",
        detail:
          "A step-through restore flow inside wp-admin with progress reported at every stage.",
      },
      {
        label: "Archive management",
        detail: "Backups are listed, labelled and removable from a single admin screen.",
      },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Most WordPress site owners only discover the true state of their backups at the worst possible moment. A plugin that appears to run nightly can be writing incomplete archives, and a restore that only covers the database leaves uploads and configuration behind. I wanted a plugin where backup and restore were designed as one operation rather than two loosely related features.",
      },
      {
        heading: "How it works",
        body: "A backup run walks the site in stages (database export first, then the filesystem in batches), writing into a single archive with a manifest describing exactly what it contains. Because each stage records its own position, a run that hits a PHP execution limit resumes from where it stopped instead of starting over. The restore path reads that same manifest, which is what keeps the two halves in agreement.",
      },
      {
        heading: "Building for review",
        body: "The plugin was written against the WordPress.org plugin guidelines: sanitised input and escaped output, capability checks and nonces on every admin action, prefixed functions and options, no bundled third-party binaries, and translation-ready strings throughout. It has been developed and prepared for WordPress.org review.",
      },
      {
        heading: "What I took from it",
        body: "Working inside WordPress means writing code that has to behave on hosting you will never see. It pushed me to design for failure states first (what happens when the process dies mid-write) rather than treating the happy path as the whole job.",
      },
    ],
    visual: "rebuzz",
    repoUrl: null,
    liveUrl: null,
    screenshots: [
      "/screenshots/rebuzz/1-dashboard.png",
      "/screenshots/rebuzz/2-backup-history.png",
      "/screenshots/rebuzz/3-restore.png",
    ],
  },
  {
    slug: "feastio",
    number: "02",
    titleLines: ["Feastio", "Restaurant management system"],
    title: "Feastio: Restaurant Management System",
    category: "Full-stack web application",
    year: "2025",
    summary:
      "A restaurant management platform for handling orders, table booking, billing, users and administration.",
    intro:
      "Feastio is a full-stack Django application that covers the working day of a restaurant: taking orders, holding and seating table bookings, producing bills, and administering staff and menu data. It is built as one system with a REST API underneath, so the interface and any future client read from the same source of truth.",
    tech: ["Django", "PostgreSQL", "HTML", "CSS", "JavaScript", "REST API"],
    status: "Full-stack application built with Django and PostgreSQL.",
    highlights: [
      {
        label: "Order lifecycle",
        detail: "Orders move through explicit states from placed to served, each transition recorded.",
      },
      {
        label: "Table booking",
        detail: "Availability and reservations modelled against time windows to avoid double-seating.",
      },
      {
        label: "Billing",
        detail: "Bills are generated from order lines, so a total always traces back to what was ordered.",
      },
      {
        label: "Roles and admin",
        detail: "Separate staff and administrator capabilities layered on Django authentication.",
      },
    ],
    sections: [
      {
        heading: "The problem",
        body: "A restaurant runs several moving parts at once: what has been ordered, which tables are free, what a customer owes, and who is allowed to change any of it. When those live in separate tools, or in one person's memory, they drift apart. Feastio was an exercise in modelling the whole thing as a single connected system.",
      },
      {
        heading: "Data first",
        body: "I started with the schema rather than the screens. Orders, order lines, tables, bookings, bills and users were defined with their relationships and constraints before any interface existed, so the rules (a bill belongs to an order, a booking occupies a table for a window) are enforced by the database rather than by whichever view happens to be running.",
      },
      {
        heading: "API and interface",
        body: "Django REST Framework exposes the domain over a REST API, and the interface consumes it for the parts of the app that update in place. Keeping the API as the contract means the dashboard, the order screens and anything added later all read the same shapes.",
      },
      {
        heading: "What I took from it",
        body: "This was the project where relational modelling stopped feeling like coursework. Getting bookings and billing right meant thinking carefully about time, state transitions, and what should be impossible to represent at all (a habit that has shaped everything I have built since).",
      },
    ],
    visual: "feastio",
    repoUrl: "https://github.com/sanishstha8/feastio",
    liveUrl: "https://feastio-one.vercel.app/",
    screenshots: [
      "/screenshots/feastio/1-landing.png",
      "/screenshots/feastio/2-login.png",
      "/screenshots/feastio/3-dashboard.png",
      "/screenshots/feastio/4-tables-orders.png",
    ],
  },
  {
    slug: "mimiclo",
    number: "03",
    titleLines: ["mimi.clo", "Online clothing store"],
    title: "mimi.clo: Online Clothing Store",
    category: "Client project · E-commerce",
    year: "2026",
    summary:
      "An online store for a women's clothing shop, with stock tracked by size, customer accounts and an admin panel.",
    intro:
      "mimi.clo is an online storefront I built for a client, a small women's clothing shop in Nepal. Shoppers can browse tees and tops, filter and search the collection, pick a colour and size, and buy straight away or add pieces to their bag. Stock is shown for every size, sale items show both the original and discounted price, and the shop owner runs everything from a built-in admin panel.",
    tech: ["Next.js", "Supabase", "Vercel"],
    status: "Live and taking visitors on Vercel.",
    highlights: [
      {
        label: "Colour and size options",
        detail: "Each piece has its own colours and sizes, and stock is tracked for every size.",
      },
      {
        label: "Admin panel",
        detail: "Add pieces, edit stock for each size, and manage categories and orders.",
      },
      {
        label: "Filters and search",
        detail: "Browse the shop by category, or search the collection.",
      },
      {
        label: "Bag and buy now",
        detail: "Add pieces to a bag with a running subtotal, or buy a single piece straight away.",
      },
      {
        label: "Customer accounts",
        detail: "Shoppers can create an account and sign in.",
      },
    ],
    sections: [
      {
        heading: "The shopping flow",
        body: "From the shop page a customer can filter by category or search, then open a piece to see its photo gallery, choose a colour and size, and either add it to the bag or buy it straight away. Low stock is flagged on both the product card and the product page, and discounted pieces show the original price next to the sale price.",
      },
      {
        heading: "Running the shop",
        body: "Behind the storefront is an admin panel with tabs for products, categories, orders and settings. From the products list the owner can add a new piece, edit or delete an existing one, and change stock for each size (S, M, L) right in the table, with the total worked out automatically. New orders show up as a count on the Admin and Orders tabs.",
      },
      {
        heading: "Under the hood",
        body: "The storefront is a Next.js app deployed on Vercel, with product images stored in Supabase. It also has a light and dark theme, and a contact page with the shop's hours and social links.",
      },
    ],
    repoUrl: "https://github.com/sanishstha8/mimiclo",
    liveUrl: "https://mimiclo-seven.vercel.app/",
    screenshots: [
      "/screenshots/mimiclo/1-shop.png",
      "/screenshots/mimiclo/2-product.png",
      "/screenshots/mimiclo/3-admin.png",
      "/screenshots/mimiclo/4-light-theme.png",
      "/screenshots/mimiclo/5-login.png",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
