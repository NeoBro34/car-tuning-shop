"use client";

import { useTranslations } from "next-intl";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("Products");
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Products pagination"
      className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-zinc-400">
        {t("pageOf", { page: currentPage, total: totalPages })}
      </p>
      <div className="flex gap-2">
        <button
          className="btn-secondary min-w-24 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          {t("previous")}
        </button>
        <button
          className="btn-secondary min-w-24 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          {t("next")}
        </button>
      </div>
    </nav>
  );
}
