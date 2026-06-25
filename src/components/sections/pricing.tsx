"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRICING_TIERS, type PricingTier } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem, Magnetic } from "@/components/motion";

const ACCENT: Record<PricingTier["accent"], string> = {
  green: "var(--signal-green)",
  cyan: "var(--signal-cyan)",
  neutral: "var(--foreground)",
};

function TierCard({ tier }: { tier: PricingTier }) {
  const accent = ACCENT[tier.accent];

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5",
        tier.featured
          ? "surface glow-green"
          : "border border-hairline bg-card/40"
      )}
    >
      {tier.featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal-green to-transparent"
        />
      )}

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {tier.badge}
        </span>
        {tier.featured && (
          <Badge variant="signal" className="uppercase tracking-wide">
            Recommended
          </Badge>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {tier.name}
      </h3>
      <p className="mt-1 font-mono text-[12px] uppercase tracking-wide text-muted-foreground">
        {tier.volume}
      </p>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span
          className="text-3xl font-semibold tracking-tight"
          style={{ color: tier.featured ? accent : "var(--foreground)" }}
        >
          {tier.price}
        </span>
        <span className="text-[12px] text-muted-foreground">
          {tier.priceNote}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
        {tier.bestFor}
      </p>

      <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-hairline to-transparent" />

      <ul className="flex flex-1 flex-col gap-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px]">
            <span
              className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full"
              style={{
                backgroundColor: `color-mix(in oklch, ${accent} 16%, transparent)`,
                color: accent,
              }}
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Magnetic strength={0.25} className="block w-full">
          <Button
            asChild
            variant={tier.featured ? "accent" : "ghost"}
            className="w-full"
          >
            <a href="#contact">{tier.cta}</a>
          </Button>
        </Magnetic>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="datasets" className="relative scroll-mt-24 py-20 md:py-28">
      <span id="licensing" className="absolute -top-24" aria-hidden />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Enterprise Value Stack"
          title="Commercial metrics & datasets"
          description="Serious commercial infrastructure for benchmark evaluation, scale training, and full platform ownership. Immutable corpora, licensed for production."
        />

        <Stagger
          stagger={0.08}
          className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3"
        >
          {PRICING_TIERS.map((tier) => (
            <StaggerItem key={tier.id} className="h-full">
              <TierCard tier={tier} />
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
          All tiers ship the full 13-engine signal coverage · seeded · immutable
          · audit-ready
        </p>
      </div>
    </section>
  );
}
