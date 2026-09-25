"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TypewriterProps = {
  words: string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  /** How long a completed word rests before it starts deleting. */
  holdMs?: number;
};

/**
 * Cycles a list of roles with a typing effect.
 *
 * Renders the first word in full on the server and on the first client paint,
 * so there is no hydration mismatch and no layout jump. Under
 * `prefers-reduced-motion` it stays on that first word — the effect never
 * starts, and CSS hides the caret (hiding it in JS would desync hydration).
 */
export function Typewriter({
  words,
  className = "",
  typeMs = 65,
  deleteMs = 32,
  holdMs = 1900,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(words[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;

    const word = words[index];
    let delay = deleting ? deleteMs : typeMs;

    if (!deleting && length === word.length) delay = holdMs;
    if (deleting && length === 0) delay = 260;

    const timer = window.setTimeout(() => {
      if (!deleting && length === word.length) {
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((current) => (current + 1) % words.length);
      } else {
        setLength((current) => current + (deleting ? -1 : 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [reduceMotion, words, index, length, deleting, typeMs, deleteMs, holdMs]);

  const visible = (words[index] ?? "").slice(0, length);

  return (
    <span className={className}>
      {/* The live region announces the role once, not character by character. */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">
        {visible}
        {/* Rendered unconditionally so server and client markup match; the
            reduced-motion media query hides it in CSS. */}
        <span className="type-caret animate-caret ml-0.5 inline-block w-[0.06em] bg-accent align-[-0.1em] text-transparent">
          |
        </span>
      </span>
    </span>
  );
}
