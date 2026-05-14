import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    danger: "bg-red-700 text-white hover:bg-red-800 disabled:bg-zinc-300 disabled:text-zinc-600",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 disabled:opacity-50",
    primary: "bg-red-600 text-white hover:bg-red-700 disabled:bg-zinc-300 disabled:text-zinc-600",
    secondary:
      "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 disabled:opacity-50",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
