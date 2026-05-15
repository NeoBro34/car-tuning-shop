"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { CartItemList } from "@/features/cart/components/cart-item-list";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useCartStore } from "@/store/cart-store";

export function CartPage() {
  const common = useTranslations("Common");
  const t = useTranslations("Cart");
  const { error, fetchCart, isLoading, items, subtotal, totalItems } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-normal text-white">
          {t("headline")}
        </h1>
      </div>

      {isLoading && items.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-36 animate-pulse rounded-lg bg-white/10"
                key={index}
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-lg bg-white/10" />
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-lg border border-red-400/30 bg-red-950/40 p-6">
          <h2 className="font-bold text-red-100">{t("loadErrorTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-red-200">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <div className="auto-card rounded-lg p-8 text-center">
          <h2 className="text-2xl font-black text-white">{t("emptyTitle")}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {t("emptyDescription")}
          </p>
          <Link className="btn-primary mt-6" href="/products">
            {common("browseProducts")}
          </Link>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          <CartItemList items={items} />
          <CartSummary subtotal={subtotal} totalItems={totalItems} />
        </div>
      ) : null}
    </section>
  );
}
