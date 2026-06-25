import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * Consistent section heading: monospace eyebrow tag, confident title, and a
 * restrained supporting line. Reveals on scroll.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-signal-green">
        <span className="size-1.5 rounded-full bg-signal-green shadow-[0_0_8px_var(--signal-green)]" />
        {eyebrow}
      </span>
      <h2
        className={cn(
          "max-w-3xl text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
