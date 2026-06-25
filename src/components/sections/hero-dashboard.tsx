"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";

import { useTelemetry, type ChannelKey } from "@/lib/telemetry";
import { MetricStat } from "@/components/visuals/metric-stat";
import { Gauge } from "@/components/visuals/gauge";
import { StatusPill } from "@/components/visuals/status-pill";
import { AnimatedCounter } from "@/components/visuals/animated-counter";

interface NodeDef {
  key: ChannelKey;
  label: string;
  unit: string;
  digits: number;
  color: string;
}

const NODES: NodeDef[] = [
  { key: "thermalRise", label: "Thermodynamics", unit: "°C", digits: 1, color: "var(--signal-amber)" },
  { key: "vibration", label: "Vibration BPFO", unit: "g", digits: 2, color: "var(--signal-green)" },
  { key: "jitter", label: "Control Loop PID", unit: "err", digits: 2, color: "var(--signal-cyan)" },
  { key: "sensorDrift", label: "Humidity Drift", unit: "%RH", digits: 2, color: "var(--signal-cyan)" },
  { key: "operatorFriction", label: "Operator Friction", unit: "idx", digits: 0, color: "var(--signal-amber)" },
  { key: "anomalyRate", label: "Data Corruption", unit: "idx", digits: 1, color: "var(--signal-amber)" },
];

/**
 * Premium dashboard preview with structured live telemetry nodes. Pulls from
 * the simulated source so the panel reads as a real operating cockpit.
 */
export function HeroDashboard() {
  const { snapshot, series } = useTelemetry(1300, 23);
  const integrity = snapshot.integrity;

  return (
    <div className="relative flex h-full flex-col gap-4 rounded-2xl surface p-5 noise">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md border border-hairline bg-white/[0.02]">
            <ShieldCheck className="size-3.5 text-signal-green" />
          </span>
          <div className="leading-tight">
            <p className="text-xs font-medium text-foreground">
              Simulation Cockpit
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              universe · U-7741-Δ
            </p>
          </div>
        </div>
        <StatusPill state={integrity.state} />
      </div>

      {/* integrity gauge */}
      <div className="flex items-center gap-4 rounded-xl border border-hairline bg-white/[0.015] p-4">
        <Gauge
          value={(integrity.value - 98) / 2}
          color="var(--signal-green)"
          size={72}
        >
          <div className="text-center leading-none">
            <span className="block text-sm font-semibold text-foreground">
              <AnimatedCounter value={integrity.value} fractionDigits={2} />
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
              %
            </span>
          </div>
        </Gauge>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Stream Integrity
          </p>
          <p className="mt-1 text-pretty text-[12px] leading-snug text-foreground/70">
            Immutable timeline verified across all 13 engines. Provenance graph
            intact.
          </p>
        </div>
      </div>

      {/* node grid */}
      <div className="grid grid-cols-2 gap-3">
        {NODES.map((node) => {
          const s = snapshot[node.key];
          return (
            <MetricStat
              key={node.key}
              label={node.label}
              value={s.value}
              unit={node.unit}
              fractionDigits={node.digits}
              state={s.state}
              series={series(node.key)}
              color={node.color}
            />
          );
        })}
      </div>
    </div>
  );
}
