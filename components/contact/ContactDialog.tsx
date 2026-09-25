"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { site } from "@/lib/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ContactDialogProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Modal contact form. Handles the four things a hand-rolled dialog usually
 * gets wrong: focus moves in on open and back to the trigger on close, Tab
 * is trapped inside, Escape closes, and the page behind cannot scroll.
 */
export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  /* Lock the page and move focus to the first field. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="contact-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/25 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.34, ease: EASE_OUT_EXPO }}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-line bg-canvas sm:rounded-2xl shadow-[0_28px_70px_-30px_rgba(15,17,21,0.5)] sm:max-w-lg"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <h2 id={titleId} className="text-lg font-semibold text-ink">
                Send me a message
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 flex h-10 w-10 items-center justify-center text-muted transition-colors duration-300 hover:text-ink"
              >
                <span className="sr-only">Close</span>
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <p className="mb-6 text-[0.9375rem] leading-relaxed text-body">
                Tell me what you are working on. I reply to everything, usually
                within a day or two.
              </p>
              <ContactForm onDone={onClose} />
            </div>

            <p className="border-t border-line px-5 py-4 text-sm text-muted sm:px-6">
              Prefer email? Write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-accent"
              >
                {site.email}
              </a>
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
