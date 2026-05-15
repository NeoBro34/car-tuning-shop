"use client";

import { CheckoutForm } from "@/features/checkout/components/checkout-form";

export function CheckoutPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
          Checkout
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-normal text-white">
          Place order
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
          Confirm your cart and provide delivery details to create an order.
        </p>
      </div>
      <CheckoutForm />
    </section>
  );
}
