"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** Pull strength toward the cursor (0..1). */
  strength?: number;
  /** Radius of the magnetic field in px. */
  radius?: number;
};

/**
 * Magnetic hover wrapper — the child drifts toward the cursor with a soft
 * spring and snaps back on leave. Disabled entirely for reduced motion and
 * for coarse (touch) pointers.
 */
export function Magnetic({
  children,
  className,
  strength = 0.4,
  radius = 120,
}: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 250, damping: 18, mass: 0.5 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={cn("inline-flex [@media(pointer:coarse)]:!transform-none", className)}
    >
      {children}
    </motion.div>
  );
}
