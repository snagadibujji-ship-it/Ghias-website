"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronRight, FileJson, Copy, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { SCENARIOS, type Scenario } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";
import { CodeCanvas } from "@/components/visuals/code-canvas";
import { StatusPill } from "@/components/visuals/status-pill";
import { Reveal } from "@/components/motion";

function ScenarioButton({
  scenario,
  active,
  onSelect,
}: {
  scenario: Scenario;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border p-3.5 text-left transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        active
          ? "border-signal-green/40 bg-[color-mix(in_oklch,var(--signal-green)_7%,transparent)]"
          : "border-hairline bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]"
      )}
    >
      {active && (
        <motion.span
          layoutId="scenario-active"
          className="absolute inset-y-0 left-0 w-0.5 bg-signal-green shadow-[0_0_10px_var(--signal-green)]"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-[13px] font-medium transition-colors",
            active ? "text-foreground" : "text-foreground/80"
          )}
        >
          {scenario.name}
        </span>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 transition-transform duration-300",
            active ? "text-signal-green" : "text-muted-foreground/50",
            active && "translate-x-0.5"
          )}
        />
      </div>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
        {scenario.summary}
      </p>
      <div className="mt-2.5">
        <StatusPill state={scenario.state} />
      </div>
    </button>
  );
}

export function CodeInspector() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = React.useState(SCENARIOS[0].id);
  const [copied, setCopied] = React.useState(false);
  const active = SCENARIOS.find((s) => s.id === activeId) ?? SCENARIOS[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.record);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="inspector" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Canvas Split-View"
          title="Live code inspector"
          description="Select an operational scenario and the inspector instantly loads its structured causal log — nested fields, drift values, status flags, and anomaly markers."
        />

        <Reveal className="mt-12 overflow-hidden rounded-2xl surface">
          <div className="grid lg:grid-cols-[300px_1fr]">
            {/* scenario selector */}
            <div className="border-b border-hairline p-4 lg:border-b-0 lg:border-r">
              <p className="mb-3 px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Operational Scenarios
              </p>
              <div className="flex flex-col gap-2">
                {SCENARIOS.map((s) => (
                  <ScenarioButton
                    key={s.id}
                    scenario={s}
                    active={s.id === activeId}
                    onSelect={() => setActiveId(s.id)}
                  />
                ))}
              </div>
            </div>

            {/* code canvas */}
            <div className="flex min-w-0 flex-col bg-[color-mix(in_oklch,var(--background)_60%,#000)]">
              <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <FileJson className="size-3.5 text-signal-cyan" />
                  <span className="text-foreground/80">
                    {active.id}.record.jsonl
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground transition-colors hover:border-white/15 hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-signal-green" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="relative min-h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="py-3"
                  >
                    <CodeCanvas
                      code={active.record}
                      highlightLines={active.highlight}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
