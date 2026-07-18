import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton loading global mientras se genera la página. */
export default function Loading() {
  return (
    <div className="container-content pt-40">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-14 w-3/4 max-w-2xl" />
      <Skeleton className="mt-4 h-14 w-1/2 max-w-xl" />
      <Skeleton className="mt-8 h-5 w-full max-w-lg" />
      <Skeleton className="mt-2 h-5 w-2/3 max-w-md" />
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
