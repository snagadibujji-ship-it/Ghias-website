"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion";
import { TerminalStream } from "@/components/visuals/terminal-stream";
import { HeroDashboard } from "./hero-dashboard";
import { easeOutExpo } from "@/lib/motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: easeOutExpo, delay },
});

export function Hero() {
  const reduced = useReducedMotion();
  const anim = (delay: number) =>
    reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay },
        }
      : fadeUp(delay);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 md:pb-28"
    >
      {/* ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <div className="absolute left-1/2 top-0 size-[42rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--signal-green)_14%,transparent),transparent_60%)] blur-2xl" />
        <div className="absolute right-0 top-40 size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--signal-cyan)_10%,transparent),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <motion.span
            {...anim(0)}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.02] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-signal-green shadow-[0_0_8px_var(--signal-green)] motion-safe:animate-[pulse-glow_3s_ease-in-out_infinite]" />
            Sovereign Causal Reality Simulator
          </motion.span>

          <motion.h1
            {...anim(0.08)}
            className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            The World&apos;s First 13-Engine{" "}
            <span className="bg-gradient-to-r from-signal-green to-signal-cyan bg-clip-text text-transparent">
              Causal Reality Simulator.
            </span>
          </motion.h1>

          <motion.p
            {...anim(0.16)}
            className="mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base"
          >
            Stop training AI models on uniform synthetic text. GHIA-CHRONOS
            simulates unbroken mechanical physics, real-world sensor decay, and
            unaligned corporate human friction on an immutable streaming
            timeline.
          </motion.p>

          <motion.div
            {...anim(0.24)}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Magnetic strength={0.3}>
              <Button asChild variant="ghost" size="lg">
                <a href="#datasets">
                  <Download className="size-4" />
                  Download 10K Honeytrap (Hugging Face)
                </a>
              </Button>
            </Magnetic>
            <Magnetic strength={0.4}>
              <Button asChild variant="accent" size="lg">
                <a href="#datasets">
                  Deploy Engine (10M Master Corpus)
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        {/* split-screen: terminal + dashboard */}
        <motion.div
          {...anim(0.34)}
          className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5"
        >
          <div className="h-[420px] lg:h-[480px]">
            <TerminalStream className="h-full" />
          </div>
          <div className="lg:h-[480px]">
            <HeroDashboard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
