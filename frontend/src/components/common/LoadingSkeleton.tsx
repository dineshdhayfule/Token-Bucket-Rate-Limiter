import { cn } from "@/utils/utils";

interface LoadingSkeletonProps {
  variant?: "card" | "table" | "chart" | "line";
  rows?: number;
  className?: string;
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-secondary/60",
        className
      )}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-5">
      <SkeletonPulse className="mb-3 h-3 w-24" />
      <SkeletonPulse className="mb-2 h-7 w-20" />
      <SkeletonPulse className="h-3 w-16" />
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="border-b border-border bg-secondary/30 px-4 py-3">
        <div className="flex gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border px-4 py-3 last:border-b-0">
          <div className="flex gap-8">
            {Array.from({ length: 5 }).map((_, j) => (
              <SkeletonPulse key={j} className="h-4 w-24" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-5">
      <SkeletonPulse className="mb-4 h-4 w-32" />
      <SkeletonPulse className="h-48 w-full rounded-lg" />
    </div>
  );
}

function LineSkeleton() {
  return <SkeletonPulse className="h-4 w-full" />;
}

export default function LoadingSkeleton({
  variant = "card",
  rows = 5,
  className,
}: LoadingSkeletonProps) {
  return (
    <div className={className}>
      {variant === "card" && <CardSkeleton />}
      {variant === "table" && <TableSkeleton rows={rows} />}
      {variant === "chart" && <ChartSkeleton />}
      {variant === "line" && <LineSkeleton />}
    </div>
  );
}
