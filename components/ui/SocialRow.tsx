import { contactChannels, isProtocolLink } from "@/lib/site";
import { BrandIcon } from "./BrandIcon";

/**
 * Round social buttons, driven by the same `contactChannels` list the contact
 * section uses. A channel with no URL yet renders as a dimmed, dashed circle
 * rather than a dead link — fill in `lib/site.ts` and it goes live.
 */
export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {contactChannels.map((channel) => {
        const label = channel.label.charAt(0) + channel.label.slice(1).toLowerCase();
        const newTab = channel.href ? !isProtocolLink(channel.href) : false;

        return (
          <li key={channel.label}>
            {channel.href ? (
              <a
                href={channel.href}
                {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-canvas transition-colors duration-300 hover:bg-accent"
              >
                <span className="sr-only">{label}</span>
                <BrandIcon name={channel.icon} className="h-5 w-5" />
              </a>
            ) : (
              <span
                title={`${label}, add the link in lib/site.ts`}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-line-strong text-faint"
              >
                <span className="sr-only">{label}, link pending</span>
                <BrandIcon name={channel.icon} className="h-5 w-5" />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
