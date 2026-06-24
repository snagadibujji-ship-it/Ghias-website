"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Token-level JSON highlighter. Returns React nodes with semantic colors that
 * map to the cinematic palette (keys cyan, strings green, numbers amber...).
 */
function highlightJson(line: string, keyPrefix: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Split into structural/whitespace, strings, numbers, literals.
  const regex =
    /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(\b-?\d+\.?\d*(?:e[+-]?\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])|(\s+)/gi;

  let match: RegExpExecArray | null;
  let i = 0;
  let lastIndex = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={`${keyPrefix}-r${i++}`}>
          {line.slice(lastIndex, match.index)}
        </span>
      );
    }
    const [raw, key, str, num, lit, punc, ws] = match;
    if (key) {
      tokens.push(
        <span key={`${keyPrefix}-k${i++}`} className="text-signal-cyan">
          {key}
        </span>
      );
    } else if (str) {
      tokens.push(
        <span key={`${keyPrefix}-s${i++}`} className="text-signal-green">
          {str}
        </span>
      );
    } else if (num) {
      tokens.push(
        <span key={`${keyPrefix}-n${i++}`} className="text-signal-amber">
          {num}
        </span>
      );
    } else if (lit) {
      tokens.push(
        <span key={`${keyPrefix}-l${i++}`} className="text-fuchsia-400/90">
          {lit}
        </span>
      );
    } else if (punc) {
      tokens.push(
        <span key={`${keyPrefix}-p${i++}`} className="text-muted-foreground">
          {punc}
        </span>
      );
    } else if (ws) {
      tokens.push(<span key={`${keyPrefix}-w${i++}`}>{ws}</span>);
    } else {
      tokens.push(<span key={`${keyPrefix}-x${i++}`}>{raw}</span>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < line.length) {
    tokens.push(
      <span key={`${keyPrefix}-rest`}>{line.slice(lastIndex)}</span>
    );
  }
  return tokens;
}

type CodeCanvasProps = {
  code: string;
  className?: string;
  /** Highlight specific 1-indexed lines (e.g. anomaly markers). */
  highlightLines?: number[];
  /** Optional editor file label. */
  filename?: string;
  showLineNumbers?: boolean;
};

/**
 * Polished editor-style JSON/JSONL canvas with line numbers, code glow and
 * exact monospace spacing. Server-renderable (no client state required).
 */
export function CodeCanvas({
  code,
  className,
  highlightLines = [],
  showLineNumbers = true,
}: CodeCanvasProps) {
  const lines = code.replace(/\n$/, "").split("\n");
  const gutterWidth = String(lines.length).length;

  return (
    <div
      className={cn(
        "relative overflow-auto font-mono text-[12.5px] leading-[1.7]",
        className
      )}
    >
      <pre className="min-w-full">
        <code className="grid">
          {lines.map((line, idx) => {
            const n = idx + 1;
            const isHi = highlightLines.includes(n);
            return (
              <span
                key={n}
                className={cn(
                  "grid grid-cols-[auto_1fr] gap-4 px-4",
                  isHi &&
                    "bg-[color-mix(in_oklch,var(--signal-green)_8%,transparent)] shadow-[inset_2px_0_0_0_var(--signal-green)]"
                )}
              >
                {showLineNumbers && (
                  <span
                    className="select-none text-right text-muted-foreground/50 tabular"
                    style={{ width: `${gutterWidth + 1}ch` }}
                  >
                    {n}
                  </span>
                )}
                <span className="whitespace-pre text-foreground/90">
                  {line ? highlightJson(line, `l${n}`) : "\u00A0"}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
