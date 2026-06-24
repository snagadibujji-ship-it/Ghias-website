"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ENGINES, type Engine } from "@/lib/site-data";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "@/components/motion";

const ACCENT: Record<Engine["accent"], string> = {
  green: "var(--signal-green)",
  cyan: "var(--signal-cyan)",
  amber: "var(--signal-amber)",
};

function EngineCard({ engine }: { engine: Engine }) {
  const Icon = engine.icon;
  const accent = ACCENT[engine.accent];

  return (
    <article
      tabIndex={0}
      className={cn(
        "edge-glow group relative flex h-full flex-col overflow-hidden rounded-xl surface p-5 outline-none transition-transform duration-300",
        "hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring/50"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="grid size-10 place-items-center rounded-lg border border-hairline bg-white/[0.02] transition-colors duration-300"
          style={{ color: accent }}
        >
          <Icon className="size-[18px]" />
        </span>
        <span className="font-mono text-[11px] tabular text-muted-foreground/60">
          {engine.index}
        </span>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
        {engine.family}
      </p>
      <h3 className="mt-1 text-[15px] font-semibold leading-snug text-foreground">
        {engine.title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {engine.description}
      </p>

      {/* hover/focus reveal: technical attributes + telemetry fragment */}
      <div
        className={cn(
          "grid grid-rows-[0fr] transition-all duration-500 ease-out",
          "group-hover:grid-rows-[1fr] group-hover:mt-4 group-focus-visible:grid-rows-[1fr] group-focus-visible:mt-4"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1.5 border-t border-hairline pt-3">
            {engine.attributes.map((attr) => (
              <div
                key={attr.key}
                className="flex items-center justify-between gap-3 font-mono text-[11px]"
              >
                <span className="text-signal-cyan">{attr.key}</span>
                <span className="tabular text-foreground/80">{attr.value}</span>
              </div>
            ))}
            <pre className="mt-2 overflow-x-auto rounded-md border border-hairline bg-black/30 px-2.5 py-1.5 font-mono text-[10.5px] leading-relaxed text-signal-green/90">
              {engine.fragment}
            </pre>
          </div>
        </div>
      </div>

      {/* baseline marker line */}
      <div
        aria-hidden
        className="mt-auto pt-4"
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-hairline to-transparent" />
      </div>
    </article>
  );
}

export function EngineGrid() {
  return (
    <section id="architecture" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid bg-grid-fade opacity-30"
      />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Nested Causal Subsystems"
          title="The 13-engine architecture"
          description="Twelve nested physical, data, and human subsystems composed by a single orchestration engine into one immutable, streaming corpus. Hover any engine to inspect its live attributes."
        />

        <Stagger
          stagger={0.05}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {ENGINES.map((engine) => (
            <StaggerItem key={engine.id} className="h-full">
              <EngineCard engine={engine} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
