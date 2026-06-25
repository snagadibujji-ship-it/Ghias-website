"use client";

import * as React from "react";

import { cn, formatNumber } from "@/lib/utils";
import { useTelemetry } from "@/lib/telemetry";
import { SectionHeading } from "./section-heading";
import { OperatorFeed } from "./operator-feed";
import { AnimatedCounter } from "@/components/visuals/animated-counter";
import { StatusPill } from "@/components/visuals/status-pill";
import { Reveal } from "@/components/motion";

export function Telemetry() {
  const { snapshot } = useTelemetry(1100, 41);

  const strip = [
    {
      label: "Throughput",
      value: snapshot.throughput.value,
      digits: 0,
      suffix: " rows/sec",
    },
    {
      label: "Memory",
      value: snapshot.memory.value,
      digits: 2,
      suffix: "GB",
      note: "1.7GB Hard-Cap",
    },
    { label: "Latency", value: snapshot.latency.value, digits: 0, suffix: "ms" },
    { label: "Jitter", value: snapshot.jitter.value, digits: 2, suffix: "" },
    {
      label: "Integrity",
      value: snapshot.integrity.value,
      digits: 2,
      suffix: "%",
    },
  ];

  const feeds = [
    {
      channelId: "CH-01 · THERMO-VIB",
      title: "rotating_assembly · bearing_stage_3",
      state: snapshot.vibration.state,
      color: "var(--signal-green)",
      seed: 2,
      metrics: [
        { label: "Vibration", value: `${snapshot.vibration.value.toFixed(2)} g` },
        { label: "Thermal", value: `${snapshot.thermalRise.value.toFixed(1)} °C` },
        { label: "Drift", value: `${snapshot.sensorDrift.value.toFixed(2)} σ` },
      ],
    },
    {
      channelId: "CH-02 · CONTROL-LOOP",
      title: "pid_controller · setpoint_tracking",
      state: snapshot.latency.state,
      color: "var(--signal-cyan)",
      seed: 5,
      metrics: [
        { label: "Latency", value: `${snapshot.latency.value.toFixed(0)} ms` },
        { label: "Jitter", value: snapshot.jitter.value.toFixed(2) },
        { label: "Queue", value: formatNumber(snapshot.queueDepth.value) },
      ],
    },
    {
      channelId: "CH-03 · SOCIO-FRICTION",
      title: "operator_layer · historian_integrity",
      state: snapshot.operatorFriction.state,
      color: "var(--signal-amber)",
      seed: 8,
      metrics: [
        { label: "Friction", value: `${snapshot.operatorFriction.value.toFixed(0)}` },
        { label: "Suppress", value: `${snapshot.suppression.value.toFixed(0)} mk` },
        { label: "Anomaly", value: `${snapshot.anomalyRate.value.toFixed(1)}/m` },
      ],
    },
  ];

  return (
    <section id="telemetry" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Mission Control"
            title="Real-time telemetry runs"
            description="Live execution output from the orchestration engine. Operator feeds stream mechanical, control, and sociotechnical signals on the immutable timeline."
          />
          <Reveal
            delay={0.1}
            className="flex items-center gap-2 rounded-full border border-hairline bg-white/[0.02] px-3 py-1.5"
          >
            <StatusPill state={snapshot.integrity.state} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              3 active channels
            </span>
          </Reveal>
        </div>

        <Reveal
          delay={0.05}
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3 lg:grid-cols-5"
        >
          {strip.map((m) => (
            <div key={m.label} className="bg-card/50 px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {m.label}
              </p>
              <p className="mt-1.5 text-xl font-semibold text-foreground">
                <AnimatedCounter value={m.value} fractionDigits={m.digits} />
                {m.suffix && (
                  <span className="ml-1 text-[12px] font-normal text-muted-foreground">
                    {m.suffix}
                  </span>
                )}
              </p>
              {m.note && (
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-signal-amber/80">
                  {m.note}
                </p>
              )}
            </div>
          ))}
        </Reveal>

        {/* operator feeds */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {feeds.map((feed, i) => (
            <Reveal key={feed.channelId} delay={0.08 * i}>
              <OperatorFeed {...feed} className={cn(i === 0 && "lg:glow-green")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
