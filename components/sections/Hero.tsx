"use client";

import { motion } from "framer-motion";
import { ActionLink } from "@/components/ui/ActionLink";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Typewriter } from "@/components/ui/Typewriter";
import { SocialRow } from "@/components/ui/SocialRow";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { resumeUrl, site, typewriterRoles } from "@/lib/site";

/** Shorthand for the staggered entrance every hero element shares. */
function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  };
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="hero-wash relative">
      <div className="shell pb-14 pt-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
          {/* ---------------------------------------------- statement */}
          {/* Spacing is tighter on phones so the statement and the portrait
              share the first screen; desktop keeps the roomier lg: values. */}
          <div className="lg:col-span-6">
            <DisplayHeading
              as="h1"
              id="hero-heading"
              className="display-hero text-ink"
              srLabel={`Hi, I'm ${site.name}`}
              immediate
              delay={0.08}
              lines={["Hi", `I'm ${site.name}`]}
            />

            {/* Short rule, then the cycling role */}
            <motion.span
              {...rise(0.45)}
              aria-hidden="true"
              className="mt-5 block h-[3px] w-24 bg-ink lg:mt-8"
            />

            <motion.div {...rise(0.55)} className="mt-4 lg:mt-8">
              <Typewriter words={typewriterRoles} className="display-role text-ink" />
            </motion.div>

            <motion.div {...rise(0.68)} className="mt-6 flex flex-wrap items-center gap-4 lg:mt-10">
              {resumeUrl ? (
                <ActionLink href={resumeUrl} variant="outline" external>
                  RESUME
                </ActionLink>
              ) : (
                <span
                  title="Add your CV to public/ and set resumeUrl in lib/site.ts"
                  className="mono-meta inline-flex items-center border-2 border-dashed border-line-strong px-6 py-4 text-faint"
                >
                  RESUME
                </span>
              )}

              <ActionLink href="/#work" variant="outline">
                PROJECTS
              </ActionLink>
            </motion.div>

            <motion.div {...rise(0.78)} className="mt-5 lg:mt-10">
              <SocialRow />
            </motion.div>
          </div>

          {/* ---------------------------------------------- portrait
              Square. Full width on phones; on tablets it takes the height left
              under the statement (~28rem). On desktop it fills its
              column toward the text, capped by the height under the nav, so the
              hero fits on one laptop screen. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="relative w-full sm:max-w-[min(24rem,max(12rem,calc(100svh_-_28rem)))] lg:col-span-6 lg:ml-auto lg:mr-0 lg:max-w-[min(44rem,max(20rem,calc(100svh_-_9.5rem)))]"
          >
            <PhotoFrame />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
