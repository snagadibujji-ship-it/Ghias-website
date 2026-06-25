"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Magnetic } from "@/components/motion";

function Logomark() {
  return (
    <a
      href="#top"
      className="group inline-flex items-baseline gap-2 font-semibold tracking-tight"
      aria-label={`${SITE.name} home`}
    >
      <span className="text-[15px] text-foreground">
        GHIA<span className="text-signal-green">-</span>CHRONOS
      </span>
      <span className="rounded border border-hairline px-1 py-px font-mono text-[9px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-signal-green">
        {SITE.version}
      </span>
    </a>
  );
}

function MasterCorpusCta({ className }: { className?: string }) {
  return (
    <Button
      asChild
      variant="accent"
      size="sm"
      className={cn("relative overflow-hidden", className)}
    >
      <a href="#datasets">
        <span
          aria-hidden
          className="absolute inset-0 -z-10 motion-safe:animate-[pulse-glow_3.2s_ease-in-out_infinite] bg-[radial-gradient(60%_120%_at_50%_0%,color-mix(in_oklch,var(--signal-green)_28%,transparent),transparent)]"
        />
        Access Master Corpus
      </a>
    </Button>
  );
}

export function Navbar() {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduced ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
    >
      <nav
        className={cn(
          "mt-3 flex w-full max-w-6xl items-center justify-between rounded-full px-3 transition-all duration-300",
          scrolled
            ? "glass-strong h-12 shadow-[0_8px_40px_-20px_rgba(0,0,0,0.9)]"
            : "h-14 border border-transparent bg-transparent"
        )}
      >
        <div className="pl-2">
          <Logomark />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Magnetic strength={0.35} className="hidden sm:inline-flex">
            <MasterCorpusCta />
          </Magnetic>

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="glass-strong w-72 border-l border-hairline p-0"
            >
              <div className="flex h-full flex-col p-6">
                <Logomark />
                <div className="mt-8 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <a
                        href={link.href}
                        className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </div>
                <div className="mt-auto">
                  <SheetClose asChild>
                    <MasterCorpusCta className="w-full" />
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
