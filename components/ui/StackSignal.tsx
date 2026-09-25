"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { TOOLKIT_SCALE, toolkitSignals } from "@/lib/content";
import { StatusDot } from "@/components/ui/StatusDot";
import { EASE_OUT_EXPO } from "@/lib/motion";

type StackSignalProps = {
  /** `floating` docks it to the viewport on desktop; `inline` sits in flow. */
  variant?: "floating" | "inline";
};

function SignalBars() {
  return (
    <ul className="space-y-2.5">
      {toolkitSignals.map((signal) => (
        <li key={signal.label} className="flex items-center gap-3">
          <span className="mono-micro w-16 shrink-0 text-faint">
            {signal.label}
          </span>
          <span aria-hidden="true" className="flex flex-1 gap-[2px]">
            {Array.from({ length: TOOLKIT_SCALE }).map((_, index) => (
              <span
                key={index}
                className={`h-2.5 flex-1 ${
                  index < signal.weight ? "bg-accent/80" : "bg-black/10"
                }`}
              />
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Panel({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "px-4 pb-4 pt-3" : "px-4 py-4 sm:px-5 sm:py-5"}>
      <SignalBars />
      <p className="mono-micro mt-4 leading-[1.7] text-faint">
        {compact
          ? "Representational: not a measured skill rating."
          : "Representational: a picture of where my day-to-day work sits, not a measured skill rating."}
      </p>
    </div>
  );
}

export function StackSignal({ variant = "floating" }: StackSignalProps) {
  /*
   * The floating HUD starts collapsed so it never sits on top of a project
   * mockup or a heading. The full panel always renders inline in the stack
   * section, so nothing here is the only route to the content.
   */
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  /* The floating panel appears once the hero is behind you... */
  useEffect(() => {
    if (variant !== "floating") return;

    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  /* ...and retracts at the footer so it never covers the closing content. */
  useEffect(() => {
    if (variant !== "floating") return;

    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -24px 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [variant]);

  const docked = pastHero && !atFooter;

  const header = (
    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
      <span className="mono-micro flex items-center gap-2 text-muted">
        <StatusDot />
        STACK SIGNAL
      </span>
      {variant === "floating" ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="stack-signal-body"
          className="-mr-1 flex h-6 w-6 items-center justify-center text-faint transition-colors duration-300 hover:text-ink"
        >
          <span className="sr-only">
            {open ? "Collapse stack signal" : "Expand stack signal"}
          </span>
          {open ? (
            <Minus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : (
            <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </button>
      ) : (
        <span className="mono-micro text-faint">CURRENT TOOLKIT</span>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <section
        aria-label="Stack signal, current toolkit"
        className="border border-line bg-panel"
      >
        {header}
        <Panel />
      </section>
    );
  }

  return (
    <AnimatePresence>
      {docked ? (
        <motion.aside
          key="stack-signal"
          aria-label="Stack signal, current toolkit"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="fixed bottom-6 left-6 z-30 hidden w-60 border border-line bg-canvas/92 backdrop-blur-xl lg:block"
        >
          {header}
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                id="stack-signal-body"
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                className="overflow-hidden"
              >
                <Panel compact />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
