"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { riseIn, stagger, viewportEarly } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element starts. */
  delay?: number;
  as?: "div" | "li" | "article" | "section";
};

/**
 * Single-element scroll reveal. Motion is neutralised automatically by the
 * app-level <MotionConfig reducedMotion="user">.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={riseIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportEarly}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "dl";
};

/** Parent that staggers any `RevealItem` descendants. */
export function RevealGroup({
  children,
  className,
  gap = 0.07,
  delay = 0,
  as = "div",
}: RevealGroupProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportEarly}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
};

export function RevealItem({ children, className, as = "div" }: RevealItemProps) {
  const Component = motion[as];

  return (
    <Component className={className} variants={riseIn}>
      {children}
    </Component>
  );
}
