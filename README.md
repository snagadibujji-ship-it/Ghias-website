# GHIA-CHRONOS v2.0 — The Sovereign Causal Reality Simulator

A hyper-futuristic, dark-mode-dominant, high-converting landing page for **GHIA-CHRONOS** —
a 13-engine causal reality simulator. Built as a premium, cinematic, production-ready
frontend foundation: Apple-hardware elegance meets OpenAI-Canvas clarity and
mission-control telemetry energy.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme` config, no `tailwind.config.js`)
- **Motion** (`motion/react`) for the animation layer
- **shadcn/ui**-style primitives (Radix UI) — authored locally for full control
- **lucide-react** icons, **sonner** + Radix toasts, **cmdk** command palette
- **pnpm** package manager

## Getting Started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # eslint
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Cinematic obsidian theme tokens, glass/glow/grid utilities
│   ├── layout.tsx           # Inter + JetBrains Mono, ThemeProvider (dark), toasters
│   └── page.tsx             # Section composition
├── components/
│   ├── ui/                  # shadcn-style primitives (button, card, dialog, tabs, ...)
│   ├── motion/              # Reveal, Stagger, Magnetic, HoverLift, Parallax
│   ├── visuals/             # AnimatedCounter, Sparkline, Gauge, WaveCanvas,
│   │                        # TerminalStream, CodeCanvas, StatusPill, MetricStat, skeletons
│   ├── sections/            # Navbar, Hero, Telemetry, EngineGrid, CodeInspector, Pricing, Footer
│   └── providers/           # next-themes provider
├── hooks/
│   └── use-toast.ts
└── lib/
    ├── utils.ts             # cn(), seeded RNG, formatters
    ├── motion.ts            # shared easing + variants
    ├── telemetry.ts         # seeded live-telemetry simulation engine + useTelemetry hook
    └── site-data.ts         # nav, 13 engines, pricing tiers, code-inspector scenarios
```

## Landing Page Sections

1. **Apple Glass Header** — sticky translucent navbar that compresses on scroll, magnetic pulsing CTA.
2. **The Quantum Terminal (Hero)** — headline + split-screen: streaming JSONL terminal & live dashboard preview.
3. **Mission Control** — real-time telemetry runs with operator feeds (faux playback, scrubber, scanlines).
4. **13-Engine Architecture** — interactive grid; hover reveals code-like attributes and telemetry fragments.
5. **Live Code Inspector** — Canvas-style split view; scenario selector loads syntax-highlighted causal logs.
6. **Enterprise Value Stack** — three commercial dataset/licensing tiers.
7. **Secure Contact Layer** — minimal footer.

## Live Telemetry Model

When no backend stream is connected, `lib/telemetry.ts` simulates the feed with seeded
sinusoidal baselines, low-frequency drift, and decaying spikes — believable, *intentional*
motion (not random noise) with real timestamps and live state labels
(`STABLE`, `DEGRADED`, `ACTIVE`, `ANOMALOUS`, ...). It is designed to be swapped for a
WebSocket / Socket.IO source later with minimal changes.

## Design & Accessibility

- Deepest-obsidian (`#09090b`) base, controlled electric-green & cyan signal accents.
- Glassmorphism, soft glow, and noise used sparingly for precision-machined depth.
- Fully responsive (ultrawide → mobile) with intelligent split-view collapse.
- Reduced-motion safe: every animation has a calm, non-motion fallback.

---

Contact / Licensing: **sangadigowtham@gmail.com**
