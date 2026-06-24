"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";

type StaggerProps = React.ComponentProps<typeof motion.div> & {
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
};

/** Container that reveals children with a staggered cascade on scroll. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.05,
  once = true,
  amount = 0.2,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={staggerContainer(stagger, delayChildren)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = React.ComponentProps<typeof motion.div>;

/** Child item for use inside <Stagger>. Reduced-motion safe. */
export function StaggerItem({
  children,
  className,
  ...props
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      variants={
        reduced
          ? {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.4 } },
            }
          : staggerItem
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
