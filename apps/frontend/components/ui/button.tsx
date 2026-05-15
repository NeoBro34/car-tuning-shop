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
    danger: "bg-red-700 text-white hover:bg-red-800 disabled:bg-zinc-700 disabled:text-zinc-400",
    ghost: "bg-transparent text-zinc-300 hover:bg-white/10 disabled:opacity-50",
    primary: "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:brightness-110 disabled:bg-zinc-700 disabled:text-zinc-400",
    secondary:
      "border border-white/10 bg-white/[0.06] text-zinc-100 hover:bg-white/10 disabled:opacity-50",
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
