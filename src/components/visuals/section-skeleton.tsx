import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Streaming-friendly placeholder for sections rendered behind a Suspense
 * boundary. Mirrors the panel chrome so layout never shifts on hydration.
 */
export function SectionSkeleton({
  className,
  rows = 3,
}: {
  className?: string;
  rows?: number;
}) {
  return (
    <div className={cn("rounded-2xl surface p-6", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="mt-6 h-px w-full" />
      <div className="mt-6 grid gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_64px] items-center gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact card grid placeholder. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl surface p-5">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="mt-4 h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-1.5 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}
