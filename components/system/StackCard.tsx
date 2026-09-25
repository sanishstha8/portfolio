"use client";

import { motion } from "framer-motion";
import { heroSystemNodes } from "@/lib/content";
import { StatusDot } from "@/components/ui/StatusDot";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Compact credential card that overlaps the hero portrait: the stack the
 * work is actually built on, listed as a small technical readout rather
 * than a row of logos.
 */
export function StackCard({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.55, ease: EASE_OUT_EXPO }}
      className={`border border-line bg-canvas shadow-[0_18px_40px_-28px_rgba(15,17,21,0.45)] ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <span className="mono-micro flex items-center gap-2 text-muted">
          <StatusDot />
          CURRENT STACK
        </span>
        <span className="mono-micro text-faint"></span>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-4 py-3.5">
        {heroSystemNodes.map((node) => (
          <li key={node.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1 w-1 shrink-0 rotate-45 bg-accent"
            />
            <span className="mono-micro truncate text-ink">{node.label}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
