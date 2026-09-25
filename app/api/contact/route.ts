import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { validateContact, type ContactPayload, type ContactResponse } from "@/lib/contact";

/** Never prerender or cache a submission endpoint. */
export const dynamic = "force-dynamic";

/**
 * Crude per-IP throttle. Serverless instances are not shared, so this is a
 * speed bump against casual abuse rather than a real rate limiter — the
 * honeypot does most of the useful work.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function json(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let input: Partial<ContactPayload>;

  try {
    input = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return json({ ok: false, code: "invalid", errors: {} }, 400);
  }

  // Honeypot: a hidden field only an automated filler would populate.
  // Answer 200 so bots learn nothing from the response.
  if (typeof input.company === "string" && input.company.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, code: "invalid", errors }, 400);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return json({ ok: false, code: "rate_limited" }, 429);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  /*
   * No provider configured yet. Say so honestly with 501 — the client then
   * hands the composed message to the visitor's mail app instead of showing
   * a "sent" confirmation for a message that went nowhere.
   */
  if (!apiKey || !from) {
    return json({ ok: false, code: "no_provider" }, 501);
  }

  const name = input.name!.trim();
  const email = input.email!.trim();
  const message = input.message!.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [site.email],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: `${message}\n\n${name} · ${email}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("Resend rejected the message:", response.status, await response.text());
      return json({ ok: false, code: "send_failed" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error("Contact send failed:", error);
    return json({ ok: false, code: "send_failed" }, 502);
  }
}
