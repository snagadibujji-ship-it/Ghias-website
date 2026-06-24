import { SITE } from "@/lib/site-data";
import { Separator } from "@/components/ui/separator";

const LEGAL_LINKS = [
  { label: "Commercial License", href: "#licensing" },
  { label: "Data Provenance", href: "#architecture" },
  { label: "Security", href: "#telemetry" },
  { label: "Terms", href: "#datasets" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-24 border-t border-hairline">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-baseline gap-2 font-semibold tracking-tight">
              <span className="text-sm text-foreground">
                GHIA<span className="text-signal-green">-</span>CHRONOS
              </span>
              <span className="rounded border border-hairline px-1 py-px font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {SITE.version}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {SITE.tagline}. Immutable causal corpora for serious builders,
              researchers, and enterprise buyers.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <Separator className="my-8 bg-hairline" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted-foreground/70">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            <span className="text-muted-foreground/60">
              Contact / Licensing:{" "}
            </span>
            <a
              href={`mailto:${SITE.contact}`}
              className="text-signal-green transition-colors hover:text-signal-cyan"
            >
              {SITE.contact}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
