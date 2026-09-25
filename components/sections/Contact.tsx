import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ContactCta } from "@/components/contact/ContactCta";
import { contactChannels, isProtocolLink, site } from "@/lib/site";

/** `contactChannels` labels are caps (the hero derives its own casing from them). */
const CHANNEL_NAMES: Record<string, string> = {
  GITHUB: "GitHub",
  LINKEDIN: "LinkedIn",
  EMAIL: "Email",
};

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeader
            id="contact-heading"
            eyebrow="Get in touch"
            title="Let's build something useful."
            intro="Whether it's an internship, a web application, or an idea worth turning into software, I'd be glad to hear about it."
          />

          <Reveal delay={0.06} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ContactCta />
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-body underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
            >
              or email me directly
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <RevealGroup as="ul" className="space-y-3">
            {contactChannels.map((channel) => {
              const name = CHANNEL_NAMES[channel.label] ?? channel.label;

              return (
                <RevealItem as="li" key={channel.label}>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      {...(isProtocolLink(channel.href)
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="group/channel flex items-center justify-between gap-4 rounded-2xl border border-line-soft bg-panel px-5 py-4 transition-colors duration-300 hover:border-line-strong"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm text-muted">{name}</span>
                        <span className="mt-0.5 block truncate font-medium text-ink">
                          {channel.value}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-faint transition-transform duration-300 group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5 group-hover/channel:text-accent"
                        strokeWidth={2}
                      />
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-line px-5 py-4">
                      <span className="min-w-0">
                        <span className="block text-sm text-muted">{name}</span>
                        <span className="mt-0.5 block truncate text-muted">Coming soon</span>
                      </span>
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal delay={0.12}>
            <p className="mt-6 text-sm text-muted">
              Based in {site.location} (UTC+05:45).
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
