import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner className="size-6 text-primary" />
      <p className="text-sm font-medium text-muted-foreground">Loading...</p>
    </div>
  );
}

export { Skeleton };
