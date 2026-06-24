"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";
import { Sparkline } from "./sparkline";
import { StatusPill } from "./status-pill";
import type { SignalState } from "@/lib/telemetry";

type MetricStatProps = {
  label: string;
  value: number;
  unit?: string;
  fractionDigits?: number;
  state?: SignalState;
  series?: number[];
  color?: string;
  className?: string;
  compact?: boolean;
};

/**
 * Border-mounted telemetry readout: label + live counter + state pill, with an
 * optional sparkline. The atomic unit of the mission-control surfaces.
 */
export function MetricStat({
  label,
  value,
  unit,
  fractionDigits = 0,
  state,
  series,
  color = "var(--signal-green)",
  className,
  compact,
}: MetricStatProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-1.5 rounded-lg border border-hairline bg-white/[0.015] p-3",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        {state && <StatusPill state={state} compact />}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-lg font-semibold leading-none text-foreground">
          <AnimatedCounter value={value} fractionDigits={fractionDigits} />
          {unit && (
            <span className="ml-1 text-[11px] font-normal text-muted-foreground">
              {unit}
            </span>
          )}
        </span>
        {!compact && series && series.length > 1 && (
          <Sparkline
            data={series}
            color={color}
            width={64}
            height={22}
            className="h-6 w-16 shrink-0"
          />
        )}
      </div>
    </div>
  );
}
