"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerPrimitive, type ToasterProps } from "sonner";

/**
 * Sonner toaster wired to the cinematic dark palette.
 */
function SonnerToaster({ ...props }: ToasterProps) {
  const { theme = "dark" } = useTheme();

  return (
    <SonnerPrimitive
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--hairline)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { SonnerToaster };
