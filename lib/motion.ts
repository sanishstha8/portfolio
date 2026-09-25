import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language. Everything on the site pulls from these so the
 * timing feels like one hand made it: long expo eases, short distances,
 * nothing bouncing.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const transition: Transition = {
  duration: 0.7,
  ease: EASE_OUT_EXPO,
};

/** Standard scroll-in: a short rise with no scale, no blur. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition },
};

/** Parent for staggered children. Children should use `riseIn`. */
export function stagger(staggerChildren = 0.07, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** Line-by-line mask reveal for large display headings. */
export const lineMaskParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075 } },
};

export const lineMaskChild: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/** Shared viewport config so every scroll reveal triggers at the same point. */
export const viewportEarly = { once: true, amount: 0.15 } as const;
