"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatCartPrice } from "@/features/cart/cart-format";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/features/checkout/checkout.schema";
import { createOrder } from "@/features/orders/order.service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { detail?: string };

    if (data.detail) {
      return data.detail;
    }
  }

  return "Could not create order.";
}

export function CheckoutForm() {
  const cart = useTranslations("Cart");
  const common = useTranslations("Common");
  const t = useTranslations("Checkout");
  const router = useRouter();
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const { user } = useAuthStore();
  const { clearCart, error, fetchCart, isLoading, items, subtotal, totalItems } =
    useCartStore();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      address: "",
      customer_name: user?.full_name ?? "",
      phone_number: "",
    },
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    async function loadCart() {
      await fetchCart();
      setHasLoadedCart(true);
    }

    loadCart();
  }, [fetchCart]);

  useEffect(() => {
    if (hasLoadedCart && !isLoading && !error && items.length === 0) {
      router.replace("/cart");
    }
  }, [error, hasLoadedCart, isLoading, items.length, router]);

  async function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) {
      toast.error(t("emptyCart"));
      router.replace("/cart");
      return;
    }

    try {
      const order = await createOrder(values);

      clearCart();
      toast.success(t("created"));
      router.replace(`/orders/success?orderId=${order.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      <form className="auto-card rounded-lg p-5" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-black text-white">{t("deliveryDetails")}</h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">
              {common("customerName")}
            </span>
            <input
              className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
              type="text"
              {...register("customer_name")}
            />
            {errors.customer_name ? (
              <p className="mt-1 text-sm text-red-300">
                {errors.customer_name.message}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-zinc-300">
              {common("phoneNumber")}
            </span>
            <input
              className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
              type="tel"
              {...register("phone_number")}
            />
            {errors.phone_number ? (
              <p className="mt-1 text-sm text-red-300">
                {errors.phone_number.message}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-zinc-300">
              {common("address")}
            </span>
            <textarea
              className="auto-input mt-2 min-h-32 w-full rounded-md px-3 py-2 text-sm"
              {...register("address")}
            />
            {errors.address ? (
              <p className="mt-1 text-sm text-red-300">
                {errors.address.message}
              </p>
            ) : null}
          </label>
        </div>

        <button
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
          disabled={isSubmitting || isLoading || !hasLoadedCart || items.length === 0}
          type="submit"
        >
          {isSubmitting ? t("creating") : t("createOrder")}
        </button>
      </form>

      <aside className="auto-card rounded-lg p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-black text-white">{t("summary")}</h2>
        {isLoading || !hasLoadedCart ? (
          <div className="mt-5 h-32 animate-pulse rounded-md bg-white/10" />
        ) : (
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-zinc-400">
              <span>{cart("items")}</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex justify-between gap-4 text-zinc-400">
              <span>{cart("subtotal")}</span>
              <span className="font-semibold">{formatCartPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-black text-white">
              <span>{common("total")}</span>
              <span>{formatCartPrice(subtotal)}</span>
            </div>
          </div>
        )}
        {error ? (
          <p className="mt-4 rounded-md border border-red-400/30 bg-red-950/40 p-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
