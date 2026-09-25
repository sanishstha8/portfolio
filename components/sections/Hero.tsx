"use client";

import { motion } from "framer-motion";
import { ActionLink } from "@/components/ui/ActionLink";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Typewriter } from "@/components/ui/Typewriter";
import { SocialRow } from "@/components/ui/SocialRow";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { StackCard } from "@/components/system/StackCard";
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
      <div className="shell pb-14 pt-28 sm:pt-32 lg:pb-28 lg:pt-32">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
          {/* ---------------------------------------------- statement */}
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
              className="mt-8 block h-[3px] w-24 bg-ink"
            />

            <motion.div {...rise(0.55)} className="mt-8">
              <Typewriter words={typewriterRoles} className="display-role text-ink" />
            </motion.div>

            <motion.div {...rise(0.68)} className="mt-10 flex flex-wrap items-center gap-4">
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

            <motion.div {...rise(0.78)} className="mt-10">
              <SocialRow />
            </motion.div>
          </div>

          {/* ---------------------------------------------- portrait
              Width is capped by viewport height (4:5 photo: width = 0.8 x the
              height left under the nav and stack card), so the whole hero fits
              on one laptop screen. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="relative mx-auto w-full max-w-sm lg:col-span-6 lg:ml-auto lg:mr-0 lg:max-w-[min(34rem,max(20rem,calc((100svh_-_11rem)_*_0.8)))] xl:max-w-[min(32rem,max(20rem,calc((100svh_-_11rem)_*_0.8)))] 2xl:max-w-[min(34rem,max(20rem,calc((100svh_-_11rem)_*_0.8)))]"
          >
            <PhotoFrame />
            <StackCard className="mx-auto mt-5 w-full max-w-xs lg:absolute lg:-bottom-6 lg:-left-4 lg:mt-0 lg:w-60 xl:-left-12 2xl:-left-16" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
