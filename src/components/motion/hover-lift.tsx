"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { springSoft } from "@/lib/motion";

type HoverLiftProps = React.ComponentProps<typeof motion.div> & {
  /** Vertical lift distance on hover (px). */
  lift?: number;
  /** Optional scale on hover. */
  scale?: number;
};

/**
 * Card lift-on-hover with crisp press feedback. Reduced-motion safe.
 */
export function HoverLift({
  children,
  className,
  lift = 6,
  scale = 1.01,
  ...props
}: HoverLiftProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      whileHover={reduced ? undefined : { y: -lift, scale }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={springSoft}
      {...props}
    >
      {children}
    </motion.div>
  );
}
