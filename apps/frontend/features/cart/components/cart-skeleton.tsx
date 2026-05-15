import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="auto-card rounded-lg p-4" key={index}>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-3 sm:w-36">
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="auto-card space-y-4 rounded-lg p-5">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
