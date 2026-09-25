import Image from "next/image";
import { UserRound } from "lucide-react";
import { heroPhoto } from "@/lib/site";

/**
 * Hero portrait in a hairline frame with accent corner brackets. Renders the
 * real photo when `heroPhoto` is set in lib/site.ts, and a labelled empty
 * frame until then — a designed empty state rather than a broken image or a
 * stock photo.
 */
export function PhotoFrame({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner brackets — the accent marks that carry through the site. */}
      <span
        aria-hidden="true"
        className="absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-accent"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -right-px z-10 h-4 w-4 border-b-2 border-r-2 border-accent"
      />

      <div
        className={`relative w-full overflow-hidden border border-line bg-shade ${
          heroPhoto ? "aspect-square" : "aspect-[3/2] sm:aspect-[4/5]"
        }`}
      >
        {heroPhoto ? (
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.alt}
            fill
            priority
            sizes="(min-width: 1536px) 44rem, (min-width: 1024px) 46vw, 24rem"
            /* Square source in a square frame, shown whole everywhere. */
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <UserRound
              aria-hidden="true"
              className="h-10 w-10 text-faint"
              strokeWidth={1}
            />
            <p className="mono-meta text-muted">YOUR PHOTO</p>
            <p className="mono-micro max-w-[15rem] leading-[1.8] text-faint">
              Add an image to public/ and set heroPhoto in lib/site.ts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
