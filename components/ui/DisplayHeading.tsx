"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { lineMaskChild, lineMaskParent, viewportEarly } from "@/lib/motion";

type DisplayHeadingProps = {
  /** Each entry becomes its own masked line. */
  lines: ReactNode[];
  /** The heading as one continuous string, for assistive technology. */
  srLabel: string;
  as?: ElementType;
  className?: string;
  /** Play on mount instead of waiting for the viewport (used by the hero). */
  immediate?: boolean;
  delay?: number;
  id?: string;
};

/**
 * Editorial display heading: every line rises out of its own clipping mask.
 * The visible lines are aria-hidden and the full string is exposed once via
 * `srLabel`, so screen readers get one heading rather than fragments.
 */
export function DisplayHeading({
  lines,
  srLabel,
  as: Component = "h2",
  className = "display-lg",
  immediate = false,
  delay = 0,
  id,
}: DisplayHeadingProps) {
  const animationProps = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: viewportEarly };

  return (
    <Component className={className} id={id}>
      <span className="sr-only">{srLabel}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        variants={lineMaskParent}
        initial="hidden"
        transition={{ delayChildren: delay }}
        {...animationProps}
      >
        {lines.map((line, index) => (
          <span key={index} className="block overflow-hidden pb-[0.09em]">
            <motion.span className="block will-change-transform" variants={lineMaskChild}>
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}
