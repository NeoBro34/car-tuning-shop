"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CartItemList } from "@/features/cart/components/cart-item-list";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { useCartStore } from "@/store/cart-store";

export function CartPage() {
  const { error, fetchCart, isLoading, items, subtotal, totalItems } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          Shopping cart
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Cart
        </h1>
      </div>

      {isLoading && items.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-36 animate-pulse rounded-lg bg-zinc-100"
                key={index}
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-lg bg-zinc-100" />
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="font-bold text-red-900">Unable to load cart</h2>
          <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-950">Your cart is empty</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Add tuning parts before starting checkout.
          </p>
          <Link className="btn-primary mt-6" href="/products">
            Browse products
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
