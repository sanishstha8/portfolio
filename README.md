# sanish.dev

Personal portfolio for **Sanish Shrestha** — Python / Django developer.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.

Light editorial theme — Poppins display, Inter body, JetBrains Mono metadata,
deep-teal accent on white.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

---

## Fill these in

Everything below renders as a **visibly pending slot** rather than a broken
link or an invented value. Nothing on the site claims anything that was not
supplied.

| What | Where | Currently |
|---|---|---|
| Portrait | `lib/site.ts` → `heroPhoto` | empty frame — drop an image in `public/`, then set `{ src, alt }` |
| CV / résumé | `lib/site.ts` → `resumeUrl` | `PENDING` — put the PDF in `public/`, then set its path |
| LinkedIn | `lib/site.ts` → `contactChannels` | `PENDING` |
| Domain | `NEXT_PUBLIC_SITE_URL` (see `.env.example`) | falls back to `https://sanishshrestha.dev` |
| Project repo / demo URLs | `lib/projects.ts` → `repoUrl`, `liveUrl` | `null` → renders a dashed `PENDING` chip |
| GitHub token (optional) | `GITHUB_TOKEN` | unauthenticated (60 req/hour/IP) |
| Contact form delivery | `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` | not set — form hands the message to the visitor's mail app |

For LinkedIn, set `href` to the profile URL and `isPlaceholder: false`; the
social icon in the hero and the row in the contact section both go live from
that one edit.

Email is already wired — `site.email` drives the "SEND A MESSAGE" button, the
contact row, the hero mail icon and the Person structured data. A public
`mailto:` will attract some spam; if that becomes a problem, swap the button
for a form (Formspree, Web3Forms) without changing anything else.

---

## Where things live

```
app/
  layout.tsx              fonts, metadata, JSON-LD, chrome
  page.tsx                section composition for the home route
  work/[slug]/page.tsx    case-study pages (statically generated)
  work/page.tsx           redirects /work → /#work
  api/contact/route.ts    contact form endpoint
  icon.tsx                generated favicon
  opengraph-image.tsx     generated 1200×630 social card
  sitemap.ts robots.ts
components/
  layout/                 Navigation, Footer
  sections/               Hero, About, Work, Process, Stack, Journey,
                          CodeActivity, Contact
  contact/                ContactCta, ContactDialog, ContactForm
  faq/                    FaqWidget — floating "Ask Me" bot
  projects/               ProjectCard, ProjectLinks, ProjectVisual
  projects/visuals/       CSS interface mockups (ReBuzz, Feastio)
  system/                 StackCard (hero), StackSignal (toolkit HUD)
  ui/                     Section, DisplayHeading, Reveal, ActionLink,
                          Typewriter, PhotoFrame, SocialRow, BrandIcon,
                          StatusDot, GridBackdrop, Cursor
lib/
  site.ts                 identity, nav, contact channels
  projects.ts             case-study content
  content.ts              process, stack, journey, toolkit copy
  contact.ts              form validation shared by client and API route
  faq.ts                  FAQ content + keyword matcher for the Ask Me bot
  github.ts               public repo fetch + graceful fallback
  motion.ts               shared easing and variants
styles/globals.css        design tokens, type scale, utilities
```

### Editing content

Almost all copy is data, not markup:

- **Projects** — `lib/projects.ts`. Adding a third entry renders a new card and
  a new `/work/<slug>` page automatically; give it a `visual` key and add the
  matching component in `components/projects/ProjectVisual.tsx`.
- **Stack, journey, process, toolkit** — `lib/content.ts`.
- **Name, nav, links** — `lib/site.ts`.

### Type sizes

Nothing on the site renders below **12px**, and body copy is **16px** —
important on a phone, since iOS Safari auto-zooms into any text input under
16px, and small type is the single most common mobile-usability complaint.
The mono utilities (`mono-meta` 13px, `mono-micro` 12px) carry letter-spacing
tuned down slightly at the larger size, so labels stay legible without
overflowing their containers.

### Design tokens

All colour, type and easing values are defined once in `styles/globals.css`
under `@theme`, and Tailwind generates the utilities (`text-ink`,
`border-line`, `display-lg`, `mono-meta`, …). Change a token there and it
propagates everywhere — the token names are semantic, not literal:

| Token | Role |
|---|---|
| `canvas` | page background (`#FFFFFF`) |
| `panel` / `shade` | raised card / inset chrome |
| `ink` | primary text (`#0F1115`) |
| `muted` | body and secondary text |
| `faint` | 10px mono metadata |
| `accent` | the one accent colour — deep teal `#0B7A6D` |

Contrast clears WCAG AA on **both** surfaces text ever sits on:

| | on `canvas` | on `shade` |
|---|---|---|
| `ink` | 18.9:1 | 16.1:1 |
| `muted` | 8.5:1 | 7.5:1 |
| `faint` | 5.2:1 | 4.7:1 |
| `accent` | 5.2:1 | 4.7:1 |

The accent also carries white text at 5.2:1, so it works as fill and as ink.

---

## Notes on the build

**Project visuals are drawn, not screenshotted — unless real ones exist.**
ReBuzz's mockup is a CSS/HTML representation of the interface, captioned as
such. Feastio now shows real product screenshots instead, in a swipeable
gallery (`ProjectGallery.tsx`) — arrow buttons, dot indicators, drag/touch
swipe, and left/right arrow-key navigation. Whichever a project has takes
priority automatically: add a `screenshots: string[]` array to a project in
`lib/projects.ts` (paths into `public/`) and its case-study page switches from
the drawn mockup to the real gallery with no other changes. Remove the array
and it falls back to the mockup again.

The `MockupFrame`/`ProjectGallery` chrome bar (context label + counter) is
shared visual language across both drawn mockups and real screenshots, so a
project doesn't look different in kind depending on which one it currently
has.

**The GitHub section reads the real API** (`lib/github.ts`), revalidated
hourly. If the API is unreachable or rate-limited at build time, the section
degrades to a plain profile link; it never renders placeholder repositories or
invented contribution counts.

**Stack Signal is labelled as representational.** The bars are a picture of
where day-to-day work sits, not a measured skill rating, and the component
says that in its own caption.

**The hero typewriter is hydration-safe.** It renders the first role in full
on the server, and the blinking caret is hidden by a CSS media query rather
than a JS branch — branching on `useReducedMotion()` during render desyncs
hydration.

## The "Ask Me" bot

A floating button, bottom-right, opens a small panel with clickable question
chips plus a free-text field. **It is a rule-based FAQ bot, not an AI model**
— the panel says so ("FAQ / NOT AI") so nobody mistakes it for one.

Every answer in `lib/faq.ts` is derived from the same data the rest of the
site reads (`lib/site.ts`, `lib/projects.ts`, `lib/content.ts`) rather than
duplicated as separate strings, so editing a project or the stack list keeps
the bot's answers in sync automatically. Free-text input is matched by a
simple keyword scorer (`matchFaq`) — no external API, no cost, nothing to
configure. A query that matches nothing gets an honest fallback pointing at
the real contact email, never a guessed answer.

Add a question: append an entry to `faqEntries` in `lib/faq.ts` with a
`question`, an `answer`, and a few lowercase `keywords` for free-text
matching.

---

## The contact form

"SEND A MESSAGE" opens a modal with name, email and message fields. It posts
to `/api/contact`, which validates again server-side (never trust the client),
drops bot submissions caught by a hidden honeypot field, and throttles to four
submissions per minute per IP.

**It works right now with no setup.** With no mail provider configured the
route answers `501 no_provider`, and the form hands the composed message to
the visitor's own mail client with subject and body pre-filled. It never shows
"Message sent" for a message that went nowhere.

**To send properly server-side** — so visitors without a mail client can reach
you — add two variables:

```bash
RESEND_API_KEY=re_...            # free key from https://resend.com
CONTACT_FROM_EMAIL=onboarding@resend.dev   # or an address on your own verified domain
```

The route then emails you directly, with the sender's address set as
`reply_to`, so hitting reply goes straight back to them. No code changes —
the form detects the upgrade on its own.

Validation rules live in `lib/contact.ts` and are imported by both the form
and the route, so the two can never disagree.

---

**Motion respects `prefers-reduced-motion`.** `<MotionConfig reducedMotion="user">`
in `components/providers/MotionProvider.tsx` neutralises transform animations
globally, a CSS media query kills the remaining keyframes, and the custom
cursor does not mount at all.

**Accessibility.** Skip link, semantic landmarks, one `h1` per page, visible
teal focus rings, an ARIA tablist with arrow-key navigation on the Feastio
mockup, Escape-to-close plus scroll lock on the mobile menu.

---

## Verified

- `npm run build` clean; every route prerendered as static HTML.
- No console errors and no horizontal overflow at 1440 / 1280 / 1024 / 768 /
  430 / 390 / 375 / 320 px, on the home page and both case studies.
- Keyboard: skip link first, logical tab order, tabs driveable by arrow keys.
- Contact form: all four API paths exercised (invalid / honeypot / no-provider
  / rate-limited), plus focus-on-open, inline validation, focus trap, Escape
  to close and focus returned to the trigger.
- Ask Me bot: chip clicks, free-text keyword matching, the no-match fallback,
  focus-on-open, and Escape-to-close verified after every submission path
  (including the click-to-send path, which needed an explicit focus fix —
  see the comment in `FaqWidget.tsx`).
- Reduced-motion pass renders the full page with motion disabled and no
  hydration errors.
