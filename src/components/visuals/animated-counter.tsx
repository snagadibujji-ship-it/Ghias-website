"use client";

import * as React from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  /** Decimal places to render. */
  fractionDigits?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** When true, count up once on first in-view (good for hero stats). */
  countOnView?: boolean;
};

/**
 * Smoothly interpolates to the target value. When `countOnView` is set it
 * counts up from zero on first reveal; otherwise it tracks live updates
 * (telemetry). Reduced-motion safe — renders the exact value with no tween.
 */
export function AnimatedCounter({
  value,
  fractionDigits = 0,
  prefix = "",
  suffix = "",
  className,
  countOnView = false,
}: AnimatedCounterProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const mv = useMotionValue(countOnView ? 0 : value);
  const spring = useSpring(mv, { stiffness: 90, damping: 22, mass: 0.7 });
  const [animated, setAnimated] = React.useState(countOnView ? 0 : value);

  React.useEffect(() => {
    if (reduced) return;
    if (countOnView && !inView) return;
    mv.set(value);
  }, [value, mv, reduced, countOnView, inView]);

  React.useEffect(() => {
    if (reduced) return;
    const unsub = spring.on("change", (v) => setAnimated(v));
    return () => unsub();
  }, [spring, reduced]);

  // Reduced motion renders the exact value with no tween.
  const shown = reduced ? value : animated;

  const formatted = shown.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
