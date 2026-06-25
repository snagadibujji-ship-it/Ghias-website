import type { Transition, Variants } from "motion/react";

/**
 * Shared motion language for GHIA-CHRONOS.
 * Apple-style easing: confident, calm, never bouncy.
 */
export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];
export const easeInOutSmooth: Transition["ease"] = [0.65, 0, 0.35, 1];

export const springSoft: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 30,
  mass: 0.8,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
};

/** Fade + rise reveal, used for scroll-driven section entries. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/** Staggered container for grids and lists. */
export const staggerContainer = (
  stagger = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

/** Scale-in used for cards and panels. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};
