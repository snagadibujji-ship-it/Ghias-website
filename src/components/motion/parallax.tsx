"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

type ParallaxProps = React.ComponentProps<typeof motion.div> & {
  /** Total travel in px across the scroll range. Negative moves up. */
  offset?: number;
};

/**
 * Subtle scroll parallax for layered depth. Disabled for reduced motion.
 */
export function Parallax({
  children,
  className,
  offset = 60,
  ...props
}: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { y }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
