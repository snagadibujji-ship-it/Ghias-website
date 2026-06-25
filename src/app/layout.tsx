import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GHIA-CHRONOS v2.0 — The Sovereign Causal Reality Simulator",
    template: "%s · GHIA-CHRONOS",
  },
  description:
    "The world's first 13-engine causal reality simulator. Unbroken mechanical physics, real-world sensor decay, and unaligned corporate human friction on an immutable streaming timeline.",
  keywords: [
    "causal simulation",
    "synthetic data",
    "AI training corpus",
    "telemetry",
    "industrial simulation",
    "GHIA-CHRONOS",
  ],
  openGraph: {
    title: "GHIA-CHRONOS v2.0 — The Sovereign Causal Reality Simulator",
    description:
      "A 13-engine causal reality simulator producing immutable, streaming corpora for serious AI builders and enterprise buyers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-dvh bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
