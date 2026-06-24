"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { STATE_STYLES, type SignalState } from "@/lib/telemetry";

type StatusPillProps = {
  state: SignalState;
  className?: string;
  /** Compact = dot + label, no border chrome. */
  compact?: boolean;
};

/**
 * Live-state pill with a breathing indicator dot. Color + pulse are driven by
 * the telemetry state model so the page reads as operational, not decorative.
 */
export function StatusPill({ state, className, compact }: StatusPillProps) {
  const style = STATE_STYLES[state];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] tabular",
        !compact &&
          "rounded-full border px-2 py-0.5 backdrop-blur-sm",
        className
      )}
      style={
        !compact
          ? {
              borderColor: `color-mix(in oklch, ${style.color} 38%, transparent)`,
              backgroundColor: `color-mix(in oklch, ${style.color} 10%, transparent)`,
              color: style.color,
            }
          : { color: style.color }
      }
    >
      <span className="relative flex size-1.5">
        {style.pulse && (
          <span
            className="absolute inline-flex size-full rounded-full opacity-75 motion-safe:animate-ping"
            style={{ backgroundColor: style.color }}
          />
        )}
        <span
          className="relative inline-flex size-1.5 rounded-full"
          style={{
            backgroundColor: style.color,
            boxShadow: `0 0 8px ${style.color}`,
          }}
        />
      </span>
      {style.label}
    </span>
  );
}
