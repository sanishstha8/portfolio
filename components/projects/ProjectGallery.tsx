"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";
import { EASE_OUT_EXPO } from "@/lib/motion";

type ProjectGalleryProps = {
  /** Paths into `public/`, in display order. */
  images: string[];
  /** Used for alt text and the chrome-bar label. */
  title: string;
  className?: string;
  /** Preload the first image. Off for galleries further down a page. */
  priority?: boolean;
};

const SWIPE_DISTANCE = 60; // px
const SWIPE_VELOCITY = 400; // px/s
/** A press that moves further than this is a swipe, not a tap. */
const TAP_TOLERANCE = 10; // px

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

/**
 * Swipeable real-screenshot gallery. Renders only when a project has
 * `screenshots` (see `ProjectVisual` for the drawn-mockup fallback), so
 * nothing here is ever a stand-in for a real image. Tapping a screenshot, or
 * the expand button, opens it full screen.
 */
export function ProjectGallery({ images, title, className = "", priority = true }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const expandRef = useRef<HTMLButtonElement>(null);
  /** Where the current press started, to tell a tap from a swipe. */
  const press = useRef<{ x: number; y: number } | null>(null);
  const total = images.length;
  const multiple = total > 1;

  function goTo(target: number, dir: number) {
    if (!multiple) return;
    setDirection(dir);
    setIndex(((target % total) + total) % total);
  }

  const next = () => goTo(index + 1, 1);
  const prev = () => goTo(index - 1, -1);

  function handlePointerDown(event: React.PointerEvent) {
    press.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: React.PointerEvent) {
    const start = press.current;
    press.current = null;
    if (!start) return;
    const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (moved < TAP_TOLERANCE) setViewerOpen(true);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) next();
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) prev();
  }

  function closeViewer() {
    setViewerOpen(false);
    expandRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  }

  return (
    <figure
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
    >
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="@container overflow-hidden border border-line bg-panel"
      >
        {/* Chrome bar, same treatment as the drawn mockups, for continuity. */}
        <div className="flex items-center justify-between gap-4 border-b border-line bg-shade/60 px-3 py-2.5">
          <span className="flex items-center gap-2 text-xs font-medium text-muted">
            <StatusDot variant="idle" />
            {title}
          </span>
          <span className="flex min-w-0 items-center gap-3">
            <span className="truncate text-xs text-faint">
              {multiple ? `Screenshot ${index + 1} of ${total}` : "Screenshot"}
            </span>
            <button
              ref={expandRef}
              type="button"
              onClick={() => setViewerOpen(true)}
              aria-label="Open screenshot full screen"
              className="-my-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-300 hover:bg-canvas hover:text-accent"
            >
              <Maximize2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </span>
        </div>

        {/* Viewport */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-shade">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              drag={multiple ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              /* Only a press that barely moves (a tap) opens the viewer; a
                 swipe just changes the screenshot. framer-motion's onTap also
                 fired after touch swipes, so tap detection is done here. */
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                press.current = null;
              }}
              className={`absolute inset-0 ${multiple ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
            >
              <Image
                src={images[index]}
                alt={`${title} screenshot ${index + 1} of ${total}`}
                fill
                priority={priority && index === 0}
                draggable={false}
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {multiple ? (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous screenshot"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-canvas/85 text-ink backdrop-blur-sm transition-colors duration-300 hover:border-line-strong hover:text-accent"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next screenshot"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-canvas/85 text-ink backdrop-blur-sm transition-colors duration-300 hover:border-line-strong hover:text-accent"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </>
          ) : null}
        </div>

        {/* Screen reader announcement, separate from the visual counter so it
            only speaks on change rather than describing the whole toolbar. */}
        <span className="sr-only" aria-live="polite">
          {multiple ? `Screenshot ${index + 1} of ${total}` : null}
        </span>

        {multiple ? (
          <div className="flex items-center justify-center gap-2 border-t border-line py-3">
            {images.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => goTo(dotIndex, dotIndex > index ? 1 : -1)}
                aria-label={`Go to screenshot ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                className="p-1.5"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    dotIndex === index ? "bg-accent" : "bg-line-strong"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ScreenshotViewer
        open={viewerOpen}
        images={images}
        title={title}
        index={index}
        direction={direction}
        onPrev={prev}
        onNext={next}
        onDragEnd={handleDragEnd}
        onClose={closeViewer}
      />
    </figure>
  );
}

type ScreenshotViewerProps = {
  open: boolean;
  images: string[];
  title: string;
  index: number;
  direction: number;
  onPrev: () => void;
  onNext: () => void;
  onDragEnd: (event: unknown, info: PanInfo) => void;
  onClose: () => void;
};

/**
 * Full-screen view of the current screenshot. It shares the gallery's index,
 * so closing it leaves the card on whichever image was last viewed. Rendered
 * into <body> because the cards sit inside transformed (animated) parents,
 * which would otherwise trap a `position: fixed` overlay.
 */
function ScreenshotViewer({
  open,
  images,
  title,
  index,
  direction,
  onPrev,
  onNext,
  onDragEnd,
  onClose,
}: ScreenshotViewerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const total = images.length;
  const multiple = total > 1;

  /* Latest handlers for the document listener, so it is not re-bound (and
     focus not reset) every time the index changes. */
  const handlers = useRef({ onPrev, onNext, onClose });
  handlers.current = { onPrev, onNext, onClose };

  useEffect(() => setMounted(true), []);

  /* Lock the page, move focus in, and handle the keyboard while open. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        handlers.current.onClose();
      } else if (event.key === "ArrowRight") {
        handlers.current.onNext();
      } else if (event.key === "ArrowLeft") {
        handlers.current.onPrev();
      } else if (event.key === "Tab" && panelRef.current) {
        // Only a handful of controls: keep focus inside the viewer.
        const controls = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>("a[href], button"),
        );
        if (controls.length === 0) return;
        const position = controls.indexOf(document.activeElement as HTMLElement);
        const step = event.shiftKey ? -1 : 1;
        event.preventDefault();
        controls[(position + step + controls.length) % controls.length].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!mounted) return null;

  const controlClass =
    "flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white " +
    "transition-colors duration-300 hover:bg-white/20";

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="screenshot-viewer"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshot ${index + 1} of ${total}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
          className="fixed inset-0 z-[95] flex flex-col bg-ink/95"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6">
            <span className="min-w-0 truncate text-sm">
              {title}
              {multiple ? (
                <span className="text-white/60">
                  {" "}
                  · {index + 1} of {total}
                </span>
              ) : null}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <a
                href={images[index]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the original image in a new tab"
                className={controlClass}
              >
                <ExternalLink aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              </a>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={controlClass}
              >
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </span>
          </div>

          {/* Image area. Tapping the empty space around the image closes. */}
          <div
            className="relative flex-1 overflow-hidden"
            onClick={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
                drag={multiple ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={onDragEnd}
                className="absolute inset-x-3 inset-y-2 sm:inset-x-20 sm:inset-y-4"
              >
                <Image
                  src={images[index]}
                  alt={`${title} screenshot ${index + 1} of ${total}`}
                  fill
                  draggable={false}
                  sizes="100vw"
                  className={`object-contain ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`}
                />
              </motion.div>
            </AnimatePresence>

            {multiple ? (
              <>
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Previous screenshot"
                  className={`${controlClass} absolute left-3 top-1/2 z-10 -translate-y-1/2 sm:left-6`}
                >
                  <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next screenshot"
                  className={`${controlClass} absolute right-3 top-1/2 z-10 -translate-y-1/2 sm:right-6`}
                >
                  <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </button>
              </>
            ) : null}
          </div>

          <p className="px-4 pb-4 pt-2 text-center text-xs text-white/60">
            {multiple ? "Swipe or use the arrows. " : ""}Press Esc or tap × to close.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
