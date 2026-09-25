"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import {
  LIMITS,
  type ContactField,
  buildMailtoUrl,
  validateContact,
  type ContactPayload,
  type ContactResponse,
  type FieldErrors,
} from "@/lib/contact";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "handoff" | "error";

const EMPTY: ContactPayload = { name: "", email: "", message: "", company: "" };

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: (describedBy: string | undefined, invalid: boolean) => React.ReactNode;
  hint?: string;
};

function Field({ id, label, error, hint, children }: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children(describedBy, Boolean(error))}
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-[0.875rem] text-accent">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const inputBase =
  "mt-2 w-full rounded-lg border bg-canvas px-3.5 py-3 text-base text-ink " +
  "transition-colors duration-200 placeholder:text-faint " +
  "focus:border-accent focus:outline-none";

export function ContactForm({ onDone }: { onDone?: () => void }) {
  const baseId = useId();
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  /* Move focus to the first field that failed, in visual order. */
  const focusFirstError = (fieldErrors: FieldErrors) => {
    const order: ContactField[] = ["name", "email", "message"];
    const first = order.find((field) => fieldErrors[field]);
    if (first) document.getElementById(`${baseId}-${first}`)?.focus();
  };

  const set = (key: keyof ContactPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key as keyof FieldErrors]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateContact(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      focusFirstError(nextErrors);
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.ok) {
        setStatus("sent");
        return;
      }

      if (result.code === "invalid") {
        setErrors(result.errors);
        setStatus("idle");
        focusFirstError(result.errors);
        return;
      }

      /*
       * No mail provider configured yet. Rather than claim success, hand the
       * composed message to the visitor's own mail client with everything
       * already filled in.
       */
      if (result.code === "no_provider") {
        window.location.href = buildMailtoUrl(values);
        setStatus("handoff");
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent" || status === "handoff") {
    const sent = status === "sent";

    return (
      <div className="py-4 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-canvas">
          <Check aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
        </span>
        <p className="display-sm mt-5 text-ink">
          {sent ? "Message sent." : "Opening your mail app."}
        </p>
        <p className="mx-auto mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-muted">
          {sent
            ? "Thanks. I read everything that comes in and will get back to you."
            : `Your message is ready to send in your email client. If nothing opened, write to ${site.email} directly.`}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-semibold text-ink transition-colors duration-300 hover:border-line-strong"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field id={`${baseId}-name`} label="Your name" error={errors.name}>
        {(describedBy, invalid) => (
          <input
            id={`${baseId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            maxLength={LIMITS.name.max}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            placeholder="Jane Doe"
            className={`${inputBase} ${invalid ? "border-accent" : "border-line"}`}
          />
        )}
      </Field>

      <Field id={`${baseId}-email`} label="Your email" error={errors.email}>
        {(describedBy, invalid) => (
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            maxLength={LIMITS.email.max}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            placeholder="jane@example.com"
            className={`${inputBase} ${invalid ? "border-accent" : "border-line"}`}
          />
        )}
      </Field>

      <Field
        id={`${baseId}-message`}
        label="Message"
        error={errors.message}
        hint={`${values.message.trim().length} / ${LIMITS.message.max}`}
      >
        {(describedBy, invalid) => (
          <textarea
            id={`${baseId}-message`}
            name="message"
            rows={5}
            value={values.message}
            onChange={set("message")}
            maxLength={LIMITS.message.max}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            placeholder="What are you building, and how can I help?"
            className={`${inputBase} resize-y ${invalid ? "border-accent" : "border-line"}`}
          />
        )}
      </Field>

      {/* Honeypot — off-screen and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${baseId}-company`}>Company</label>
        <input
          id={`${baseId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={set("company")}
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="border border-line bg-shade px-3.5 py-3 text-[0.9375rem] leading-relaxed text-muted">
          That did not go through. Please try again, or email{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-2">
            {site.email}
          </a>{" "}
          directly.
        </p>
      ) : null}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group/action inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-canvas transition-colors duration-300 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? (
            <>
              Sending…
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            </>
          ) : (
            <>
              Send message
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover/action:translate-x-1"
                strokeWidth={1.5}
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
