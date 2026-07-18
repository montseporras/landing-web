import { cn } from "@/lib/utils";

/** Bloque de carga con shimmer suave. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-2xl bg-gradient-to-r from-sand-100 via-sand-50 to-sand-100 bg-[length:200%_100%]",
        className,
      )}
    />
  );
}
