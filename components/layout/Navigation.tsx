"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { StatusDot } from "@/components/ui/StatusDot";
import { EASE_OUT_EXPO } from "@/lib/motion";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Compact the bar once the hero has started to leave. */
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll spy — only meaningful on the single-page home route. */
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }

    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  /* Escape to close, and lock the page behind the mobile panel. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  /* Close the panel whenever the route changes. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <a
        href="#main"
        className="mono-meta sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-accent focus:px-4 focus:py-3 focus:text-canvas"
      >
        SKIP TO CONTENT
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          compact || menuOpen
            ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="shell">
          <div
            className={`flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              compact ? "h-14 md:h-16" : "h-20 md:h-24"
            }`}
          >
            <Link
              href="/"
              className="mono-nav text-ink transition-colors duration-300 hover:text-accent"
              aria-label={`${site.name}, home`}
            >
              {site.shortName}
            </Link>

            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        aria-current={isActive ? "true" : undefined}
                        className={`mono-nav relative block px-3 py-2 transition-colors duration-300 lg:px-4 ${
                          isActive ? "text-ink" : "text-muted hover:text-ink"
                        }`}
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-3 bottom-0 h-px origin-left bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:inset-x-4 ${
                            isActive ? "scale-x-100" : "scale-x-0"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <span className="mono-nav hidden items-center gap-2 text-muted sm:flex">
                <StatusDot />
                {site.availability}
              </span>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="-mr-2 flex h-11 w-11 items-center justify-center text-ink transition-colors duration-300 hover:text-accent md:hidden"
              >
                <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
                {menuOpen ? (
                  <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-40 bg-canvas md:hidden"
          >
            <div className="shell flex h-full flex-col pb-10 pt-24">
              <nav aria-label="Mobile" className="flex-1">
                <ul className="flex flex-col">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.05 + index * 0.05,
                        ease: EASE_OUT_EXPO,
                      }}
                      className="border-b border-line-soft"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-baseline py-5"
                      >
                        <span className="display-sm text-ink">{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center justify-between border-t border-line pt-6">
                <span className="mono-meta flex items-center gap-2 text-muted">
                  <StatusDot />
                  {site.availability}
                </span>
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-meta text-muted transition-colors hover:text-accent"
                >
                  GITHUB ↗
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
