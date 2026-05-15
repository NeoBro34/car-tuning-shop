import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/82">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductFiltersSkeleton() {
  return (
    <aside className="auto-card rounded-lg p-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="mt-5 space-y-5">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </aside>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-5 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-11 w-24" />
        <Skeleton className="h-11 w-24" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-5 w-36" />
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton className="aspect-square" key={index} />
            ))}
          </div>
        </div>
        <div className="auto-card space-y-5 rounded-lg p-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-24 w-full" />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-16 w-36" />
            <Skeleton className="h-11 flex-1" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="h-44" key={index} />
        ))}
      </div>
      <div className="mt-12">
        <Skeleton className="mb-5 h-8 w-48" />
        <ProductGridSkeleton count={3} />
      </div>
    </section>
  );
}
