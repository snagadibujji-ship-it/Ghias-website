"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

type GaugeProps = {
  /** Normalised 0..1 value. */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Radial telemetry gauge (270° sweep). Pure SVG, smoothly animated via CSS
 * stroke transition. Used for compact pressure / integrity readouts.
 */
export function Gauge({
  value,
  size = 76,
  strokeWidth = 6,
  color = "var(--signal-green)",
  trackColor = "color-mix(in oklch, var(--foreground) 10%, transparent)",
  className,
  children,
}: GaugeProps) {
  const v = clamp(value, 0, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const sweep = 0.75; // 270 degrees
  const dash = circumference * sweep;
  const offset = dash * (1 - v);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[135deg]"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)",
            filter: `drop-shadow(0 0 4px color-mix(in oklch, ${color} 60%, transparent))`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
