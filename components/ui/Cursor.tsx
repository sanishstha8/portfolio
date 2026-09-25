"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RING_SIZE = 28;
const DOT_SIZE = 4;

/**
 * Two-part cursor: a dot that tracks exactly and a ring that trails on a
 * spring and grows over interactive elements. Mounts only for fine pointers
 * that have not asked for reduced motion, and never replaces the native
 * cursor — it rides on top of it.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(finePointer.matches && !reducedMotion.matches);
    sync();

    finePointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
    return () => {
      finePointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, summary, [data-cursor="expand"]';

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visible) setVisible(true);

      const target = event.target as Element | null;
      setActive(Boolean(target?.closest?.(interactiveSelector)));
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    document.addEventListener("pointerenter", handleEnter);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      document.removeEventListener("pointerenter", handleEnter);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <div className="cursor-layer pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
      <motion.span
        className="absolute rounded-full bg-accent"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.span
        className="absolute rounded-full border"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: active ? 1.5 : 1,
          opacity: visible ? (active ? 1 : 0.5) : 0,
          borderColor: active ? "rgba(11,122,109,0.85)" : "rgba(15,17,21,0.35)",
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
