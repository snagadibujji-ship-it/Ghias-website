"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type TerminalStreamProps = {
  className?: string;
  /** Max rows retained in the scroll buffer. */
  maxRows?: number;
  /** Characters typed per animation frame batch. */
  speed?: number;
  title?: string;
};

const SIGNALS = [
  { sys: "thermo", field: "core_temp_c", base: 61, span: 9, unit: "" },
  { sys: "vibration", field: "bpfo_g", base: 0.52, span: 0.4, unit: "" },
  { sys: "control_loop", field: "pid_err", base: 0.014, span: 0.02, unit: "" },
  { sys: "humidity", field: "rh_drift", base: 0.31, span: 0.12, unit: "" },
  { sys: "operator", field: "friction_idx", base: 31, span: 14, unit: "" },
  { sys: "historian", field: "corruption", base: 0.002, span: 0.006, unit: "" },
  { sys: "sensor", field: "drift_sigma", base: 0.43, span: 0.5, unit: "" },
];

const STATES = ["STABLE", "ACTIVE", "DEGRADED", "RECOVERING", "ANOMALOUS"];

function buildRow(seed: number, epochMs?: number): string {
  const sig = SIGNALS[seed % SIGNALS.length];
  const jitter = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
  const value = (sig.base + jitter * sig.span).toFixed(
    sig.base < 1 ? 4 : 2
  );
  const drift = ((Math.cos(seed * 7.13) * 0.5 + 0.5) * 0.4).toFixed(3);
  const state =
    Math.abs(jitter) > 0.82
      ? "ANOMALOUS"
      : STATES[Math.floor(Math.abs(jitter) * 4)];
  const ts = new Date(epochMs ?? Date.now()).toISOString();
  return `{"t":"${ts}","engine":"${sig.sys}","${sig.field}":${value},"drift":${drift},"state":"${state}"}`;
}

interface Row {
  id: number;
  text: string;
}

/**
 * Streaming JSONL terminal with subtle typewriter pacing and live ISO
 * timestamps. Generates believable mechanical / environmental / social signal
 * drift. Reduced-motion safe (renders a static recent buffer, no typing).
 */
export function TerminalStream({
  className,
  maxRows = 13,
  speed = 3,
  title = "chronos://stream/master-corpus.jsonl",
}: TerminalStreamProps) {
  const reduced = useReducedMotion();
  const [rows, setRows] = React.useState<Row[]>([]);
  const [typing, setTyping] = React.useState("");
  const seedRef = React.useRef(11);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Deterministic static buffer for reduced motion (stable across SSR/CSR).
  const STATIC_EPOCH = 1_750_000_000_000;
  const staticRows = React.useMemo<Row[]>(
    () =>
      reduced
        ? Array.from({ length: maxRows }, (_, i) => ({
            id: i,
            text: buildRow(i + 3, STATIC_EPOCH + i * 1200),
          }))
        : [],
    [reduced, maxRows]
  );

  React.useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let target = buildRow(seedRef.current);
    let pos = 0;
    let holdUntil = 0;

    const loop = (ts: number) => {
      if (ts < holdUntil) {
        raf = requestAnimationFrame(loop);
        return;
      }
      if (pos < target.length) {
        pos = Math.min(target.length, pos + speed);
        setTyping(target.slice(0, pos));
        raf = requestAnimationFrame(loop);
      } else {
        // Commit the completed row and start the next one after a short hold.
        const committed = target;
        const id = seedRef.current;
        setRows((prev) => {
          const next = [...prev, { id, text: committed }];
          return next.slice(-maxRows);
        });
        setTyping("");
        seedRef.current += 1;
        target = buildRow(seedRef.current);
        pos = 0;
        holdUntil = ts + 420;
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, maxRows, speed]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rows, typing]);

  const displayRows = reduced ? staticRows : rows;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl surface",
        className
      )}
    >
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="ml-2 truncate font-mono text-[11px] text-muted-foreground">
          {title}
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-signal-green">
          <span className="size-1.5 rounded-full bg-signal-green shadow-[0_0_8px_var(--signal-green)] motion-safe:animate-[pulse-glow_2s_ease-in-out_infinite]" />
          live
        </span>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3 font-mono text-[11.5px] leading-[1.65]"
      >
        {displayRows.map((r) => (
          <div key={r.id} className="whitespace-pre-wrap break-all text-foreground/70">
            <span className="text-muted-foreground/40 select-none">{"› "}</span>
            <JsonLine text={r.text} />
          </div>
        ))}
        {!reduced && typing && (
          <div className="whitespace-pre-wrap break-all text-foreground/90">
            <span className="text-muted-foreground/40 select-none">{"› "}</span>
            <JsonLine text={typing} />
            <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-signal-green/90 motion-safe:animate-[pulse-glow_1s_steps(2)_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Minimal inline JSON coloring for the streaming rows. */
function JsonLine({ text }: { text: string }) {
  const parts = text.split(/("(?:\\.|[^"\\])*"\s*:?|-?\d+\.?\d*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^".*":$/.test(p))
          return (
            <span key={i} className="text-signal-cyan">
              {p}
            </span>
          );
        if (/^"/.test(p))
          return (
            <span key={i} className="text-signal-green">
              {p}
            </span>
          );
        if (/^-?\d/.test(p))
          return (
            <span key={i} className="text-signal-amber">
              {p}
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
