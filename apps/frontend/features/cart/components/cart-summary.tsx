"use client";

import Link from "next/link";
import { formatCartPrice } from "@/features/cart/cart-format";

type CartSummaryProps = {
  subtotal: number;
  totalItems: number;
};

export function CartSummary({ subtotal, totalItems }: CartSummaryProps) {
  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-950">Order summary</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-zinc-600">
          <span>Items</span>
          <span className="font-semibold">{totalItems}</span>
        </div>
        <div className="flex justify-between gap-4 text-zinc-600">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCartPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 text-base font-black text-zinc-950">
          <span>Total</span>
          <span>{formatCartPrice(subtotal)}</span>
        </div>
      </div>
      <Link
        className={`btn-primary mt-5 w-full ${totalItems === 0 ? "pointer-events-none opacity-50" : ""}`}
        href="/checkout"
      >
        Checkout
      </Link>
    </aside>
  );
}
