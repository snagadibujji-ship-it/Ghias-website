"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SparklineProps = {
  data: number[];
  className?: string;
  color?: string;
  /** Show the soft area fill under the line. */
  fill?: boolean;
  /** Show the glowing leading dot at the latest sample. */
  head?: boolean;
  strokeWidth?: number;
  width?: number;
  height?: number;
};

/**
 * Lightweight SVG sparkline for live signals. Auto-scales to the data window,
 * renders a soft gradient area + glowing head node. No chart library needed.
 */
export function Sparkline({
  data,
  className,
  color = "var(--signal-green)",
  fill = true,
  head = true,
  strokeWidth = 1.5,
  width = 100,
  height = 32,
}: SparklineProps) {
  const id = React.useId().replace(/:/g, "");

  const { line, area, headX, headY } = React.useMemo(() => {
    if (data.length < 2) {
      return { line: "", area: "", headX: 0, headY: height / 2 };
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const pad = strokeWidth + 1;

    const pts = data.map((v, i) => {
      const x = i * stepX;
      const y = pad + (height - pad * 2) * (1 - (v - min) / range);
      return [x, y] as const;
    });

    const line = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    const last = pts[pts.length - 1];
    const area = `${line} L${width},${height} L0,${height} Z`;

    return { line, area, headX: last[0], headY: last[1] };
  }, [data, width, height, strokeWidth]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("overflow-visible", className)}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sl-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && line && <path d={area} fill={`url(#sl-${id})`} />}
      {line && (
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {head && line && (
        <g>
          <circle cx={headX} cy={headY} r={3.5} fill={color} opacity={0.25} />
          <circle cx={headX} cy={headY} r={1.8} fill={color}>
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}
    </svg>
  );
}
