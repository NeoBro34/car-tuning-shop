import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "auto-input w-full rounded-md px-3 py-2 text-sm transition disabled:bg-zinc-900 disabled:text-zinc-500",
        className,
      )}
      {...props}
    />
  );
}
