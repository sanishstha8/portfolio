"use client";

import { useEffect } from "react";

/**
 * Every fresh visit or refresh starts at the top of the page, on the hero.
 *
 * Two things otherwise open the site part-way down: a leftover "#about"-style
 * hash in the address (added whenever a nav link is used, then copied,
 * bookmarked or reopened), and the browser restoring the last scroll position
 * on reload. This drops the hash and turns restoration off. It lives in the
 * root layout, so it runs once per full page load. In-site navigation (nav
 * links, "All projects") still scrolls to its section as before.
 */
export function StartAtTop() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    if (window.location.hash) {
      // Keep Next.js's history state; only the hash is removed.
      history.replaceState(history.state, "", window.location.pathname + window.location.search);
    }

    // The browser's own jump to the old hash can still be settling when this
    // runs, so reset a few times over the first moments. The first touch,
    // wheel or key press cancels it, so it never fights the visitor.
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    const toTop = () => {
      // "instant" overrides the global smooth scrolling, so there is no visible glide up.
      if (!cancelled) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    const events = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    events.forEach((name) => window.addEventListener(name, cancel, { passive: true, once: true }));

    toTop();
    const frame = requestAnimationFrame(toTop);
    const timers = [120, 400].map((ms) => window.setTimeout(toTop, ms));

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      events.forEach((name) => window.removeEventListener(name, cancel));
    };
  }, []);

  return null;
}
