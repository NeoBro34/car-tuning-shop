"use client";

import { AlertTriangle, LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

type ErrorStateProps = {
  description: string;
  title: string;
  type?: "network" | "unauthorized";
  onRetry?: () => void;
};

export function ErrorState({
  description,
  title,
  type = "network",
  onRetry,
}: ErrorStateProps) {
  const common = useTranslations("Common");
  const Icon = type === "unauthorized" ? LockKeyhole : AlertTriangle;

  return (
    <div className="rounded-lg border border-red-400/30 bg-red-950/40 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-red-500/15 text-red-200">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-black text-red-100">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-red-200">{description}</p>
          </div>
        </div>
        {onRetry ? (
          <button
            className="btn-secondary min-h-10 shrink-0 px-4 text-sm"
            onClick={onRetry}
            type="button"
          >
            {common("retry")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
