"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { faqEntries, matchFaq } from "@/lib/faq";
import { site } from "@/lib/site";
import { EASE_OUT_EXPO } from "@/lib/motion";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  text: "Hi! Ask me about my stack, projects, or how to reach me.",
};

const FALLBACK_TEXT = `I don't have a canned answer for that one. Try one of the questions below, or reach out directly at ${site.email}.`;

/**
 * A rule-based "Ask Me" widget, not an AI model. Every answer either comes
 * from a keyword match against `lib/faq.ts` or, when nothing matches, an
 * honest fallback pointing at a real contact channel — it never invents a
 * response, matching the "no fabricated content" rule the rest of the site
 * follows for pending states.
 */
export function FaqWidget() {
  const pathname = usePathname();
  const titleId = useId();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Close on route change so it never carries over onto a project page. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Focus the input as soon as the panel finishes mounting. */
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  /* Keep the transcript pinned to the latest message. */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (open && event.key === "Escape") {
      event.stopPropagation();
      close();
    }
  }

  function ask(question: string, answer: string) {
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages((current) => [
      ...current,
      { id: `${stamp}-q`, role: "user", text: question },
      { id: `${stamp}-a`, role: "bot", text: answer },
    ]);
  }

  function handleChip(entryId: string) {
    const entry = faqEntries.find((candidate) => candidate.id === entryId);
    if (!entry) return;
    ask(entry.question, entry.answer);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const match = matchFaq(text);
    ask(text, match ? match.answer : FALLBACK_TEXT);
    setDraft("");
    /*
     * The submit button disables itself once the field is empty (to block
     * blank submissions), and a browser blurs a focused element the instant
     * it goes disabled — straight to <body>, outside the panel, which broke
     * Escape-to-close after a click-submit. Reclaiming focus here fixes that
     * and doubles as the UX a chat input should have anyway: ready to type
     * the next question immediately.
     */
    inputRef.current?.focus();
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className="fixed bottom-5 right-5 z-30 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
            className="absolute bottom-[4.5rem] right-0 flex h-[min(28rem,70dvh)] w-[calc(100vw-2.5rem)] max-w-sm flex-col border border-line bg-canvas shadow-[0_28px_70px_-30px_rgba(15,17,21,0.5)] sm:w-96"
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3.5">
              <h2 id={titleId} className="text-base font-semibold text-ink">
                Ask me anything
              </h2>
              <span className="text-xs text-muted">Quick answers, not AI</span>
            </div>

            <div
              ref={logRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[85%] px-3.5 py-2.5 text-[0.875rem] leading-relaxed ${
                      message.role === "user"
                        ? "bg-ink text-canvas"
                        : "border border-line bg-shade text-ink"
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-4 py-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {faqEntries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleChip(entry.id)}
                    className="shrink-0 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-sm text-body transition-colors duration-300 hover:border-line-strong hover:text-ink"
                  >
                    {entry.question}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <label htmlFor={`${titleId}-input`} className="sr-only">
                  Ask a question
                </label>
                <input
                  ref={inputRef}
                  id={`${titleId}-input`}
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a question…"
                  className="flex-1 border border-line bg-canvas px-3 py-2.5 text-[0.875rem] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!draft.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-canvas transition-colors duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_14px_34px_-14px_rgba(15,17,21,0.55)] transition-colors duration-300 hover:bg-accent"
      >
        <span className="sr-only">{open ? "Close question panel" : "Ask a question"}</span>
        {open ? (
          <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <MessageCircle aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
