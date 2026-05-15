"use client";

import { Link } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { CartItemList } from "@/features/cart/components/cart-item-list";
import { CartSkeleton } from "@/features/cart/components/cart-skeleton";
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
        <CartSkeleton />
      ) : null}

      {!isLoading && error ? (
        <ErrorState
          description={error}
          onRetry={fetchCart}
          title={t("loadErrorTitle")}
        />
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <EmptyState
          action={
            <Link className="btn-primary" href="/products">
              {common("browseProducts")}
            </Link>
          }
          description={t("emptyDescription")}
          icon={<ShoppingCart aria-hidden="true" className="size-6" />}
          title={t("emptyTitle")}
        />
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
