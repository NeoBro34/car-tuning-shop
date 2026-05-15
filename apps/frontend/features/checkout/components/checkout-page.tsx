"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const CheckoutForm = dynamic(
  () =>
    import("@/features/checkout/components/checkout-form").then(
      (module) => module.CheckoutForm,
    ),
  {
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="auto-card h-96 animate-pulse rounded-lg" />
        <div className="auto-card h-52 animate-pulse rounded-lg" />
      </div>
    ),
  },
);

export function CheckoutPage() {
  const t = useTranslations("Checkout");

  return (
    <section className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-normal text-white">
          {t("headline")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
          {t("description")}
        </p>
      </div>
      <CheckoutForm />
    </section>
  );
}
