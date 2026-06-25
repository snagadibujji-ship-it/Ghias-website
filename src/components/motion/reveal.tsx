"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

type RevealProps = React.ComponentProps<typeof motion.div> & {
  /** Delay before the reveal starts (seconds). */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  /** Re-trigger every time it scrolls into view. */
  once?: boolean;
  /** Viewport margin for the intersection trigger. */
  amount?: number;
  as?: React.ElementType;
};

/**
 * Scroll-driven entry animation. Reduced-motion safe: falls back to a
 * simple opacity transition (no transform/blur) when the user prefers it.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.3,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4, delay } },
      }
    : {
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease: easeOutExpo, delay },
        },
      };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
