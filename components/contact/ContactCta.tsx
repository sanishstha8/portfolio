"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ContactDialog } from "./ContactDialog";

/**
 * The primary contact call to action. Opens the form dialog and returns focus
 * to this button when it closes, so keyboard users are never dropped at the
 * top of the page.
 */
export function ContactCta({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`group/action inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-canvas transition-colors duration-300 hover:bg-accent-hover ${className}`}
        data-cursor="expand"
      >
        Send me a message
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/action:translate-x-1"
          strokeWidth={2}
        />
      </button>

      <ContactDialog open={open} onClose={close} />
    </>
  );
}
