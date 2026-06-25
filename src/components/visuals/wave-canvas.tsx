"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type WaveCanvasProps = {
  className?: string;
  color?: string;
  /** Pause the animation (e.g. operator feed paused). */
  playing?: boolean;
  /** Number of stacked signal traces. */
  traces?: number;
  /** Animation seed for varied motion per feed. */
  seed?: number;
};

/**
 * Canvas-driven multi-trace telemetry waveform. Believable signal motion with
 * drift + noise, device-pixel-ratio aware, and reduced-motion safe (renders a
 * single static frame).
 */
export function WaveCanvas({
  className,
  color = "var(--signal-green)",
  playing = true,
  traces = 3,
  seed = 1,
}: WaveCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = seed * 10;

    // Resolve the CSS custom property color to a concrete value.
    const probe = document.createElement("span");
    probe.style.color = color;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color || "rgb(52,232,162)";
    probe.remove();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      for (let tr = 0; tr < traces; tr++) {
        const phase = seed * 1.7 + tr * 2.1;
        const amp = (h / (traces + 1)) * (0.32 - tr * 0.04);
        const midY = (h / (traces + 1)) * (tr + 1);
        const opacity = 0.9 - tr * 0.26;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const nx = x / w;
          const y =
            midY +
            Math.sin(nx * 9 + t * 0.9 + phase) * amp * 0.6 +
            Math.sin(nx * 23 - t * 1.6 + phase) * amp * 0.28 +
            Math.sin(nx * 47 + t * 2.4) * amp * 0.12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = resolved;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = tr === 0 ? 1.6 : 1;
        ctx.shadowColor = resolved;
        ctx.shadowBlur = tr === 0 ? 8 : 0;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    };

    if (reduced || !playing) {
      draw();
      return () => ro.disconnect();
    }

    const loop = () => {
      t += 0.022;
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [color, playing, traces, seed, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("size-full", className)}
      aria-hidden="true"
    />
  );
}
