"use client";

import * as React from "react";

import { clamp } from "@/lib/utils";

/**
 * ===========================================================================
 * GHIA-CHRONOS telemetry simulation
 * ---------------------------------------------------------------------------
 * Produces believable, NON-random live signals: each channel follows a slow
 * sinusoidal baseline + low-frequency drift + occasional spikes that decay
 * (cooldown). When no backend stream is connected, this stands in for it and
 * still feels operational. Designed to be swapped for a WebSocket feed later.
 * ===========================================================================
 */

export type SignalState =
  | "STABLE"
  | "DEGRADED"
  | "ACTIVE"
  | "COMPRESSED"
  | "SUPPRESSED"
  | "ANOMALOUS"
  | "RECOVERING";

export type ChannelKey =
  | "throughput"
  | "memory"
  | "latency"
  | "jitter"
  | "integrity"
  | "queueDepth"
  | "anomalyRate"
  | "thermalRise"
  | "vibration"
  | "sensorDrift"
  | "operatorFriction"
  | "suppression";

export interface ChannelSpec {
  key: ChannelKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  baseline: number;
  /** Baseline oscillation amplitude. */
  amplitude: number;
  /** Oscillation period in seconds. */
  period: number;
  /** Noise magnitude. */
  noise: number;
  /** Probability per tick of a spike event. */
  spikeChance: number;
  /** Spike magnitude as a fraction of range. */
  spikeMag: number;
  /** Higher value = better when high (integrity), else lower is better. */
  higherIsBetter?: boolean;
  fractionDigits?: number;
}

export const CHANNELS: ChannelSpec[] = [
  { key: "throughput", label: "Throughput", unit: "rows/s", min: 9000, max: 16000, baseline: 14319, amplitude: 900, period: 14, noise: 220, spikeChance: 0.04, spikeMag: 0.18, higherIsBetter: true },
  { key: "memory", label: "Memory", unit: "GB", min: 1.2, max: 1.7, baseline: 1.52, amplitude: 0.08, period: 22, noise: 0.02, spikeChance: 0.02, spikeMag: 0.12, fractionDigits: 2 },
  { key: "latency", label: "Latency", unit: "ms", min: 14, max: 60, baseline: 23, amplitude: 5, period: 11, noise: 1.4, spikeChance: 0.05, spikeMag: 0.4, fractionDigits: 0 },
  { key: "jitter", label: "Jitter", unit: "ms", min: 0.02, max: 0.4, baseline: 0.08, amplitude: 0.03, period: 7, noise: 0.012, spikeChance: 0.05, spikeMag: 0.5, fractionDigits: 2 },
  { key: "integrity", label: "Stream Integrity", unit: "%", min: 98.4, max: 99.99, baseline: 99.92, amplitude: 0.05, period: 19, noise: 0.02, spikeChance: 0.03, spikeMag: 0.5, higherIsBetter: true, fractionDigits: 2 },
  { key: "queueDepth", label: "Queue Depth", unit: "evt", min: 0, max: 4200, baseline: 740, amplitude: 260, period: 9, noise: 70, spikeChance: 0.06, spikeMag: 0.5, fractionDigits: 0 },
  { key: "anomalyRate", label: "Anomaly Rate", unit: "/min", min: 0, max: 18, baseline: 2.1, amplitude: 1.1, period: 13, noise: 0.5, spikeChance: 0.06, spikeMag: 0.6, fractionDigits: 1 },
  { key: "thermalRise", label: "Thermal Rise", unit: "°C", min: 38, max: 92, baseline: 61, amplitude: 6, period: 26, noise: 1.1, spikeChance: 0.03, spikeMag: 0.3, fractionDigits: 1 },
  { key: "vibration", label: "Vibration BPFO", unit: "g", min: 0.1, max: 2.4, baseline: 0.52, amplitude: 0.16, period: 6, noise: 0.05, spikeChance: 0.05, spikeMag: 0.6, fractionDigits: 2 },
  { key: "sensorDrift", label: "Sensor Drift", unit: "σ", min: 0, max: 3.2, baseline: 0.43, amplitude: 0.2, period: 17, noise: 0.06, spikeChance: 0.04, spikeMag: 0.5, fractionDigits: 2 },
  { key: "operatorFriction", label: "Operator Friction", unit: "idx", min: 0, max: 100, baseline: 31, amplitude: 9, period: 21, noise: 2.4, spikeChance: 0.04, spikeMag: 0.4, fractionDigits: 0 },
  { key: "suppression", label: "Multilingual Suppression", unit: "mk", min: 0, max: 64, baseline: 12, amplitude: 5, period: 15, noise: 1.6, spikeChance: 0.05, spikeMag: 0.5, fractionDigits: 0 },
];

export const CHANNEL_MAP: Record<ChannelKey, ChannelSpec> = CHANNELS.reduce(
  (acc, c) => {
    acc[c.key] = c;
    return acc;
  },
  {} as Record<ChannelKey, ChannelSpec>
);

interface ChannelRuntime {
  spike: number; // current spike contribution (decays each tick)
  driftPhase: number;
}

function deriveState(
  spec: ChannelSpec,
  value: number,
  spike: number
): SignalState {
  const span = spec.max - spec.min;
  const norm = (value - spec.min) / span; // 0..1
  const stressed = spec.higherIsBetter ? 1 - norm : norm;

  if (spike > span * 0.16) return "ANOMALOUS";
  if (spec.key === "suppression" && value > spec.baseline * 1.6)
    return "SUPPRESSED";
  if (spec.key === "memory" && value > spec.max * 0.98) return "COMPRESSED";
  if (stressed > 0.78) return "DEGRADED";
  if (stressed > 0.55) return "RECOVERING";
  if (stressed > 0.3) return "ACTIVE";
  return "STABLE";
}

export interface Sample {
  value: number;
  state: SignalState;
  t: number;
}

/**
 * Stateful telemetry source. Advance with `tick()`; pull channel history with
 * `series()`. Deterministic given a seed so motion feels intentional.
 */
export class TelemetrySource {
  private runtime: Record<ChannelKey, ChannelRuntime>;
  private history: Record<ChannelKey, Sample[]>;
  private elapsed = 0;
  private readonly historyLen: number;

  constructor(seed = 7, historyLen = 64) {
    this.historyLen = historyLen;
    this.runtime = {} as Record<ChannelKey, ChannelRuntime>;
    this.history = {} as Record<ChannelKey, Sample[]>;
    CHANNELS.forEach((c, i) => {
      this.runtime[c.key] = {
        spike: 0,
        driftPhase: (seed + i * 37) % 100,
      };
      this.history[c.key] = [];
    });
  }

  tick(dt = 1) {
    this.elapsed += dt;
    CHANNELS.forEach((spec) => {
      const rt = this.runtime[spec.key];
      const span = spec.max - spec.min;

      // Slow baseline oscillation + secondary low-frequency drift.
      const osc =
        Math.sin((this.elapsed / spec.period) * Math.PI * 2 + rt.driftPhase) *
        spec.amplitude;
      const drift =
        Math.sin((this.elapsed / (spec.period * 3.3)) * Math.PI * 2) *
        spec.amplitude *
        0.4;

      // Pseudo-noise (cheap, time-seeded, smooth-ish).
      const noise =
        (Math.sin(this.elapsed * 12.9898 + rt.driftPhase * 78.233) * 43758.5453 % 1) *
        spec.noise;

      // Spike event + exponential cooldown.
      if (Math.random() < spec.spikeChance) {
        rt.spike = span * spec.spikeMag * (0.6 + Math.random() * 0.4);
      }
      rt.spike *= 0.78;
      const spikeDir = spec.higherIsBetter ? -1 : 1;

      const value = clamp(
        spec.baseline + osc + drift + noise + rt.spike * spikeDir,
        spec.min,
        spec.max
      );

      const sample: Sample = {
        value,
        state: deriveState(spec, value, rt.spike),
        t: this.elapsed,
      };

      const arr = this.history[spec.key];
      arr.push(sample);
      if (arr.length > this.historyLen) arr.shift();
    });
  }

  latest(key: ChannelKey): Sample {
    const arr = this.history[key];
    return arr[arr.length - 1] ?? { value: CHANNEL_MAP[key].baseline, state: "STABLE", t: 0 };
  }

  series(key: ChannelKey): number[] {
    return this.history[key].map((s) => s.value);
  }

  snapshot(): Record<ChannelKey, Sample> {
    const out = {} as Record<ChannelKey, Sample>;
    CHANNELS.forEach((c) => (out[c.key] = this.latest(c.key)));
    return out;
  }
}

/**
 * React hook exposing a live telemetry snapshot. Prefilled with history so the
 * sparklines render immediately. Pauses cleanly and respects unmount.
 */
export function useTelemetry(intervalMs = 1200, seed = 7) {
  // Stable source instance, warmed up so charts have shape on first paint.
  const [source] = React.useState(() => {
    const s = new TelemetrySource(seed);
    for (let i = 0; i < 48; i++) s.tick();
    return s;
  });

  const [snapshot, setSnapshot] = React.useState<Record<ChannelKey, Sample>>(
    () => source.snapshot()
  );
  const [version, setVersion] = React.useState(0);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      source.tick();
      setSnapshot(source.snapshot());
      setVersion((v) => v + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, running, source]);

  const series = React.useCallback(
    (key: ChannelKey) => source.series(key),
    [source]
  );

  return { snapshot, series, version, running, setRunning };
}

/** Map a signal state to its accent token + treatment. */
export const STATE_STYLES: Record<
  SignalState,
  { color: string; label: string; pulse?: boolean }
> = {
  STABLE: { color: "var(--signal-green)", label: "STABLE" },
  ACTIVE: { color: "var(--signal-cyan)", label: "ACTIVE", pulse: true },
  RECOVERING: { color: "var(--signal-cyan)", label: "RECOVERING" },
  COMPRESSED: { color: "var(--signal-amber)", label: "COMPRESSED" },
  SUPPRESSED: { color: "var(--signal-amber)", label: "SUPPRESSED" },
  DEGRADED: { color: "var(--signal-amber)", label: "DEGRADED", pulse: true },
  ANOMALOUS: { color: "var(--signal-red)", label: "ANOMALOUS", pulse: true },
};
