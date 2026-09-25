import { site } from "./site";

/**
 * Contact form contract, shared by the client form and the API route so the
 * two can never drift. The server revalidates everything regardless — the
 * client copy exists to give fast feedback, not to be trusted.
 */

export type ContactField = "name" | "email" | "message";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  /** Honeypot. Real people never see it, so anything here means a bot. */
  company?: string;
};

export type FieldErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 4000 },
} as const;

/** Deliberately permissive — the only real proof an address works is a reply. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<ContactPayload>): FieldErrors {
  const errors: FieldErrors = {};

  const name = (input.name ?? "").trim();
  if (name.length < LIMITS.name.min) {
    errors.name = "Please enter your name.";
  } else if (name.length > LIMITS.name.max) {
    errors.name = `Keep this under ${LIMITS.name.max} characters.`;
  }

  const email = (input.email ?? "").trim();
  if (!email) {
    errors.email = "Please enter your email so I can reply.";
  } else if (email.length > LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = "That does not look like a valid email address.";
  }

  const message = (input.message ?? "").trim();
  if (message.length < LIMITS.message.min) {
    errors.message = `A little more detail, please: at least ${LIMITS.message.min} characters.`;
  } else if (message.length > LIMITS.message.max) {
    errors.message = `Keep this under ${LIMITS.message.max} characters.`;
  }

  return errors;
}

/** Response codes the route returns, so the UI can react to each precisely. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; code: "invalid"; errors: FieldErrors }
  | { ok: false; code: "no_provider" }
  | { ok: false; code: "rate_limited" }
  | { ok: false; code: "send_failed" };

/**
 * Fallback used when no email provider is configured: hand the composed
 * message to the visitor's own mail client rather than silently dropping it
 * or claiming it was sent.
 */
export function buildMailtoUrl(payload: ContactPayload): string {
  const subject = `Portfolio enquiry from ${payload.name.trim()}`;
  const body = [
    payload.message.trim(),
    "",
    `${payload.name.trim()} · ${payload.email.trim()}`,
  ].join("\n");

  return `mailto:${site.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
