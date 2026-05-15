"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { formatCartPrice } from "@/features/cart/cart-format";

type CartSummaryProps = {
  subtotal: number;
  totalItems: number;
};

export function CartSummary({ subtotal, totalItems }: CartSummaryProps) {
  const common = useTranslations("Common");
  const t = useTranslations("Cart");

  return (
    <aside className="auto-card rounded-lg p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-black text-white">{t("summary")}</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-zinc-400">
          <span>{t("items")}</span>
          <span className="font-semibold">{totalItems}</span>
        </div>
        <div className="flex justify-between gap-4 text-zinc-400">
          <span>{t("subtotal")}</span>
          <span className="font-semibold">{formatCartPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-black text-white">
          <span>{common("total")}</span>
          <span>{formatCartPrice(subtotal)}</span>
        </div>
      </div>
      <Link
        className={`btn-primary mt-5 w-full ${totalItems === 0 ? "pointer-events-none opacity-50" : ""}`}
        href="/checkout"
      >
        {common("checkout")}
      </Link>
    </aside>
  );
}
