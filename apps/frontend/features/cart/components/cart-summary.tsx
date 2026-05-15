"use client";

import Link from "next/link";
import { formatCartPrice } from "@/features/cart/cart-format";

type CartSummaryProps = {
  subtotal: number;
  totalItems: number;
};

export function CartSummary({ subtotal, totalItems }: CartSummaryProps) {
  return (
    <aside className="auto-card rounded-lg p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-black text-white">Order summary</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4 text-zinc-400">
          <span>Items</span>
          <span className="font-semibold">{totalItems}</span>
        </div>
        <div className="flex justify-between gap-4 text-zinc-400">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCartPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-black text-white">
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
