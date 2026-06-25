"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { WaveCanvas } from "@/components/visuals/wave-canvas";
import { StatusPill } from "@/components/visuals/status-pill";
import type { SignalState } from "@/lib/telemetry";

type FeedMetric = { label: string; value: string };

type OperatorFeedProps = {
  channelId: string;
  title: string;
  state: SignalState;
  color?: string;
  seed?: number;
  metrics: FeedMetric[];
  className?: string;
};

function formatTimecode(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const f = Math.floor((totalSeconds % 1) * 24); // 24fps feel
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

/**
 * Premium embedded operator feed: faux-playback waveform, live indicator,
 * timecode chrome, scrubber, border-mounted metrics, scanline + noise.
 */
export function OperatorFeed({
  channelId,
  title,
  state,
  color = "var(--signal-green)",
  seed = 1,
  metrics,
  className,
}: OperatorFeedProps) {
  const [playing, setPlaying] = React.useState(true);
  const [elapsed, setElapsed] = React.useState(seed * 137 + 412);

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed((e) => e + 0.25), 250);
    return () => clearInterval(id);
  }, [playing]);

  const progress = ((elapsed % 90) / 90) * 100;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl surface scanlines noise",
        className
      )}
    >
      {/* top chrome */}
      <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5 text-signal-red">
            <span className="size-1.5 rounded-full bg-signal-red shadow-[0_0_8px_var(--signal-red)] motion-safe:animate-[pulse-glow_1.6s_ease-in-out_infinite]" />
            REC
          </span>
          <span className="text-foreground/50">·</span>
          <span>{channelId}</span>
        </div>
        <span className="font-mono text-[10px] tabular text-foreground/70">
          {formatTimecode(elapsed)}
        </span>
      </div>

      {/* viewport */}
      <div className="relative aspect-video w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--signal-green)_4%,transparent),transparent_70%)]">
        <WaveCanvas color={color} playing={playing} seed={seed} traces={3} />

        {/* center crosshair */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent 49.7%, color-mix(in oklch, var(--foreground) 8%, transparent) 50%, transparent 50.3%), linear-gradient(to bottom, transparent 49.7%, color-mix(in oklch, var(--foreground) 8%, transparent) 50%, transparent 50.3%)",
          }}
        />

        {/* feed label */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <StatusPill state={state} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="truncate font-mono text-[11px] text-foreground/80">
            {title}
          </p>
        </div>
      </div>

      {/* transport */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause feed" : "Play feed"}
          className="grid size-7 shrink-0 place-items-center rounded-full border border-hairline bg-white/[0.03] text-foreground transition-colors hover:border-signal-green/50 hover:text-signal-green"
        >
          {playing ? (
            <Pause className="size-3 fill-current" />
          ) : (
            <Play className="size-3 translate-x-px fill-current" />
          )}
        </button>
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${progress}%`,
              background: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>
        <span className="shrink-0 font-mono text-[10px] tabular text-muted-foreground">
          24fps
        </span>
      </div>

      {/* border-mounted metrics */}
      <div className="grid grid-cols-3 gap-px border-t border-hairline bg-hairline">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card/40 px-3 py-2">
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-0.5 font-mono text-[12px] tabular text-foreground">
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
