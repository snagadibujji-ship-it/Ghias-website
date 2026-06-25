import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Boxes,
  CircuitBoard,
  Clock,
  Cpu,
  Fingerprint,
  GitBranch,
  Languages,
  Network,
  ShieldAlert,
  Thermometer,
  Users,
  Waves,
} from "lucide-react";

export const SITE = {
  name: "GHIA-CHRONOS",
  version: "v2.0",
  tagline: "The Sovereign Causal Reality Simulator",
  contact: "sangadigowtham@gmail.com",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Architecture", href: "#architecture" },
  { label: "Live Telemetry", href: "#telemetry" },
  { label: "Datasets", href: "#datasets" },
  { label: "Commercial Licensing", href: "#licensing" },
];

export interface EngineAttribute {
  key: string;
  value: string;
}

export interface Engine {
  id: string;
  index: string;
  title: string;
  family: string;
  description: string;
  icon: LucideIcon;
  accent: "green" | "cyan" | "amber";
  /** Code-like attributes revealed on hover. */
  attributes: EngineAttribute[];
  /** Hidden telemetry fragment surfaced on hover. */
  fragment: string;
}

export const ENGINES: Engine[] = [
  {
    id: "environmental-electrical",
    index: "01",
    title: "Environmental & Electrical Loops",
    family: "Substrate",
    description:
      "Couples ambient conditions to bus voltage, ripple, and brownout propagation across the plant.",
    icon: CircuitBoard,
    accent: "cyan",
    attributes: [
      { key: "bus_voltage", value: "480V ±3.2%" },
      { key: "ripple_pp", value: "0.42V" },
      { key: "coupling", value: "ambient→load" },
    ],
    fragment: '{"phase_imbalance":0.018,"brownout_risk":"low"}',
  },
  {
    id: "thermodynamics-lubricant",
    index: "02",
    title: "Thermodynamics & Lubricant Engines",
    family: "Mechanical",
    description:
      "Models heat transfer, viscosity breakdown, and film thickness under sustained mechanical load.",
    icon: Thermometer,
    accent: "amber",
    attributes: [
      { key: "core_temp_c", value: "61.4" },
      { key: "oil_visc_cSt", value: "46 → 41" },
      { key: "film_microns", value: "1.8" },
    ],
    fragment: '{"thermal_rise":"6.2C/hr","lubricant_state":"DEGRADING"}',
  },
  {
    id: "vibration-failure",
    index: "03",
    title: "Vibration & Failure Signatures",
    family: "Mechanical",
    description:
      "Generates BPFO/BPFI bearing harmonics and incipient fault spectra with realistic sidebands.",
    icon: Waves,
    accent: "green",
    attributes: [
      { key: "bpfo_g", value: "0.52" },
      { key: "harmonics", value: "1x,2x,3x" },
      { key: "kurtosis", value: "3.9" },
    ],
    fragment: '{"defect_freq_hz":162.4,"sideband_db":-18}',
  },
  {
    id: "sociotechnical-friction",
    index: "04",
    title: "Sociotechnical Friction Layer",
    family: "Human",
    description:
      "Injects unaligned corporate behavior — shift handovers, conflicting priorities, and silent overrides.",
    icon: Users,
    accent: "amber",
    attributes: [
      { key: "friction_idx", value: "31/100" },
      { key: "handover_loss", value: "0.14" },
      { key: "override_rate", value: "2.1/shift" },
    ],
    fragment: '{"unlogged_action":true,"escalation":"suppressed"}',
  },
  {
    id: "historian-corruption",
    index: "05",
    title: "Historian Corruption Layer",
    family: "Data Integrity",
    description:
      "Simulates tag dropouts, backfilled values, and tampered timestamps in the process historian.",
    icon: ShieldAlert,
    accent: "amber",
    attributes: [
      { key: "corruption", value: "0.002" },
      { key: "backfill", value: "detected" },
      { key: "tag_dropouts", value: "7/24h" },
    ],
    fragment: '{"ts_rewrite":true,"provenance":"BROKEN"}',
  },
  {
    id: "control-loop-feedback",
    index: "06",
    title: "Control Loop Feedback Engine",
    family: "Control",
    description:
      "Closed-loop PID dynamics with windup, oscillation, and setpoint chasing under disturbance.",
    icon: Activity,
    accent: "cyan",
    attributes: [
      { key: "pid_err", value: "0.014" },
      { key: "Kp/Ki/Kd", value: "2.1/0.4/0.08" },
      { key: "loop_state", value: "TRACKING" },
    ],
    fragment: '{"overshoot_pct":4.2,"settling_s":12.6}',
  },
  {
    id: "operator-behavior",
    index: "07",
    title: "Operator Behavior Simulation",
    family: "Human",
    description:
      "Reproduces fatigue curves, alarm desensitization, and non-procedural intervention patterns.",
    icon: Fingerprint,
    accent: "green",
    attributes: [
      { key: "fatigue", value: "0.38" },
      { key: "alarm_ack_ms", value: "8400" },
      { key: "deviation", value: "non-proc" },
    ],
    fragment: '{"ack_storm":true,"attention":"DEGRADED"}',
  },
  {
    id: "network-degeneration",
    index: "08",
    title: "Network Degeneration Engine",
    family: "Substrate",
    description:
      "Packet loss, fieldbus jitter, and progressive latency creep across the OT network fabric.",
    icon: Network,
    accent: "cyan",
    attributes: [
      { key: "latency_ms", value: "23 → 47" },
      { key: "jitter", value: "0.08" },
      { key: "pkt_loss", value: "0.4%" },
    ],
    fragment: '{"fieldbus":"degraded","retransmit":18}',
  },
  {
    id: "sensor-drift",
    index: "09",
    title: "Sensor Drift Engine",
    family: "Data Integrity",
    description:
      "Calibration decay, bias walk, and stuck-at faults modeled per transducer over the timeline.",
    icon: Cpu,
    accent: "green",
    attributes: [
      { key: "drift_sigma", value: "0.43" },
      { key: "bias_walk", value: "+0.012/hr" },
      { key: "stuck_at", value: "0 active" },
    ],
    fragment: '{"recalibration_due":true,"trust":0.82}',
  },
  {
    id: "multilingual-suppression",
    index: "10",
    title: "Multilingual Suppression Layer",
    family: "Data Integrity",
    description:
      "Models language-gated reporting, redaction, and selective translation of incident records.",
    icon: Languages,
    accent: "amber",
    attributes: [
      { key: "locales", value: "11 active" },
      { key: "redaction", value: "0.21" },
      { key: "markers", value: "12" },
    ],
    fragment: '{"suppressed_locale":"xx-XX","state":"SUPPRESSED"}',
  },
  {
    id: "causal-trace",
    index: "11",
    title: "Causal Trace Engine",
    family: "Causality",
    description:
      "Maintains an immutable cause→effect graph linking every signal to its upstream root events.",
    icon: GitBranch,
    accent: "cyan",
    attributes: [
      { key: "edges", value: "2.4M" },
      { key: "depth", value: "9 hops" },
      { key: "root_conf", value: "0.94" },
    ],
    fragment: '{"root_event":"E-3391","propagation":"verified"}',
  },
  {
    id: "temporal-consistency",
    index: "12",
    title: "Temporal Consistency Engine",
    family: "Causality",
    description:
      "Guarantees monotonic, ordered time across all engines — no paradoxes, no retro-causality.",
    icon: Clock,
    accent: "green",
    attributes: [
      { key: "clock_skew_ms", value: "0.3" },
      { key: "ordering", value: "monotonic" },
      { key: "paradox", value: "0" },
    ],
    fragment: '{"timeline":"immutable","drift_corrected":true}',
  },
  {
    id: "master-corpus-orchestration",
    index: "13",
    title: "Master Corpus Orchestration Engine",
    family: "Orchestration",
    description:
      "Composes all 12 subsystems into a single streaming corpus with deterministic, seeded universes.",
    icon: Boxes,
    accent: "green",
    attributes: [
      { key: "engines", value: "12 nested" },
      { key: "throughput", value: "14.3K rows/s" },
      { key: "universe", value: "seeded" },
    ],
    fragment: '{"corpus":"10M","integrity":99.92,"state":"ACTIVE"}',
  },
];

export interface PricingTier {
  id: string;
  badge: string;
  name: string;
  volume: string;
  price: string;
  priceNote: string;
  bestFor: string;
  features: string[];
  cta: string;
  featured?: boolean;
  accent: "green" | "cyan" | "neutral";
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "evaluation-shard",
    badge: "TIER 1",
    name: "Evaluation Shard",
    volume: "100K Lines",
    price: "$5,000",
    priceNote: "baseline license",
    bestFor: "Benchmark evaluation & targeted SFT",
    features: [
      "100K immutable streaming rows",
      "Full 13-engine signal coverage",
      "Causal trace + provenance graph",
      "JSONL export, single universe seed",
      "Standard licensing terms",
    ],
    cta: "Acquire Evaluation Shard",
    accent: "neutral",
  },
  {
    id: "enterprise-production-shard",
    badge: "TIER 2",
    name: "Enterprise Production Shard",
    volume: "10M Lines",
    price: "$50,000",
    priceNote: "baseline license",
    bestFor: "Scale training & multi-universe generation",
    features: [
      "10M immutable streaming rows",
      "Multi-universe seeded generation",
      "Priority orchestration throughput",
      "Anomaly + suppression annotation sets",
      "Dedicated integration support",
    ],
    cta: "Deploy Production Shard",
    featured: true,
    accent: "green",
  },
  {
    id: "platform-buyout",
    badge: "TIER 0",
    name: "Platform Buyout",
    volume: "Full Source IP",
    price: "Custom",
    priceNote: "enterprise licensing",
    bestFor: "Infinite universe generation, in-house",
    features: [
      "Full source IP transfer",
      "Infinite universe generation code",
      "All 13 engines, unrestricted",
      "On-prem / air-gapped deployment",
      "Sovereign commercial terms",
    ],
    cta: "Request Buyout Briefing",
    accent: "cyan",
  },
];

export interface Scenario {
  id: string;
  name: string;
  summary: string;
  state: "STABLE" | "DEGRADED" | "ANOMALOUS";
  /** Lines (1-indexed) to flag as anomaly markers in the canvas. */
  highlight: number[];
  record: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "cold-startup",
    name: "Cold Startup Cycle",
    summary: "Plant transitions from cold idle to nominal operating envelope.",
    state: "STABLE",
    highlight: [9],
    record: `{
  "t": "2026-06-24T06:00:00.000Z",
  "scenario": "cold_startup_cycle",
  "universe_seed": "U-7741-Δ",
  "thermo": { "core_temp_c": 22.4, "ramp_c_per_min": 3.1, "lubricant": "COLD" },
  "control_loop": { "pid_err": 0.214, "state": "CHASING_SETPOINT" },
  "vibration": { "bpfo_g": 0.18, "kurtosis": 2.6 },
  "operator": { "fatigue": 0.04, "procedure": "SOP-114", "deviation": false },
  "stream": { "throughput_rows_s": 9120, "integrity": 99.98 },
  "status": "STABLE",
  "anomaly": null
}`,
  },
  {
    id: "thermal-runaway",
    name: "Incipient Thermal Runaway Anomaly",
    summary: "Lubricant film collapse drives an unbounded positive thermal feedback loop.",
    state: "ANOMALOUS",
    highlight: [5, 11, 12],
    record: `{
  "t": "2026-06-24T14:37:12.480Z",
  "scenario": "incipient_thermal_runaway",
  "universe_seed": "U-7741-Δ",
  "thermo": { "core_temp_c": 88.9, "ramp_c_per_min": 11.7, "lubricant": "FILM_COLLAPSE" },
  "control_loop": { "pid_err": 0.061, "windup": true, "state": "SATURATED" },
  "vibration": { "bpfo_g": 1.94, "kurtosis": 7.2, "sideband_db": -6 },
  "operator": { "fatigue": 0.41, "alarm_ack_ms": 14200, "deviation": true },
  "causal_trace": { "root_event": "E-3391", "propagation": "verified", "depth": 6 },
  "stream": { "throughput_rows_s": 13980, "integrity": 99.4 },
  "status": "ANOMALOUS",
  "anomaly": { "code": "THERM-RUNAWAY-02", "severity": "HIGH", "ttl_s": 168 }
}`,
  },
  {
    id: "data-coverup",
    name: "Active Data Cover-Up Event",
    summary: "Historian timestamps are rewritten and incident records selectively suppressed.",
    state: "DEGRADED",
    highlight: [6, 7, 12],
    record: `{
  "t": "2026-06-24T21:08:55.117Z",
  "scenario": "active_data_coverup",
  "universe_seed": "U-7741-Δ",
  "historian": { "corruption": 0.061, "ts_rewrite": true, "provenance": "BROKEN" },
  "suppression": { "locales": 11, "redaction": 0.34, "suppressed_locale": "xx-XX" },
  "operator": { "override_rate": 4.0, "unlogged_action": true },
  "sensor": { "drift_sigma": 1.12, "trust": 0.58 },
  "causal_trace": { "root_event": "E-5582", "tamper_detected": true },
  "temporal": { "clock_skew_ms": 42.6, "ordering": "VIOLATED" },
  "stream": { "throughput_rows_s": 14210, "integrity": 98.6 },
  "status": "DEGRADED",
  "anomaly": { "code": "PROV-TAMPER-07", "severity": "CRITICAL", "ttl_s": 0 }
}`,
  },
];
