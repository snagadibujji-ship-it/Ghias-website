import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Telemetry } from "@/components/sections/telemetry";
import { EngineGrid } from "@/components/sections/engine-grid";
import { CodeInspector } from "@/components/sections/code-inspector";
import { Pricing } from "@/components/sections/pricing";
import { Footer } from "@/components/sections/footer";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SectionDivider />
        <Telemetry />
        <SectionDivider />
        <EngineGrid />
        <SectionDivider />
        <CodeInspector />
        <SectionDivider />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Separator className="bg-gradient-to-r from-transparent via-hairline to-transparent" />
    </div>
  );
}
