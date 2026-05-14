"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { formatCartPrice } from "@/features/cart/cart-format";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

type CartItemListProps = {
  items: CartItem[];
};

export function CartItemList({ items }: CartItemListProps) {
  const { isLoading, removeItem, updateQuantity } = useCartStore();

  async function handleQuantityChange(item: CartItem, quantity: number) {
    const nextQuantity = Math.min(Math.max(quantity, 1), item.product.stock_quantity);

    try {
      await updateQuantity(item.id, nextQuantity);
      toast.success("Cart updated");
    } catch {
      toast.error("Could not update cart item");
    }
  }

  async function handleRemove(itemId: number) {
    try {
      await removeItem(itemId);
      toast.success("Item removed");
    } catch {
      toast.error("Could not remove item");
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const activePrice = item.product.discount_price ?? item.product.price;
        const isAtStockLimit = item.quantity >= item.product.stock_quantity;

        return (
          <article
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            key={item.id}
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <Link
                  className="text-lg font-bold text-zinc-950 hover:text-red-700"
                  href={`/products/${item.product.slug}`}
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-zinc-600">SKU {item.product.sku}</p>
                <p className="mt-3 text-sm font-semibold text-zinc-700">
                  {formatCartPrice(activePrice)} each
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Stock: {item.product.stock_quantity}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <p className="text-lg font-black text-zinc-950">
                  {formatCartPrice(item.line_subtotal)}
                </p>
                <div className="grid h-10 w-32 grid-cols-[2.5rem_1fr_2.5rem] overflow-hidden rounded-md border border-zinc-300">
                  <button
                    className="border-r border-zinc-300 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isLoading || item.quantity <= 1}
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    className="w-full text-center text-sm font-bold outline-none"
                    disabled={isLoading}
                    max={item.product.stock_quantity}
                    min="1"
                    onChange={(event) =>
                      handleQuantityChange(item, Number(event.target.value))
                    }
                    type="number"
                    value={item.quantity}
                  />
                  <button
                    className="border-l border-zinc-300 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isLoading || isAtStockLimit}
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                {isAtStockLimit ? (
                  <p className="text-xs font-semibold text-red-600">
                    Stock limit reached
                  </p>
                ) : null}
                <button
                  className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => handleRemove(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
