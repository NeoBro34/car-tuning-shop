"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { formatCartPrice } from "@/features/cart/cart-format";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

type CartItemListProps = {
  items: CartItem[];
};

export function CartItemList({ items }: CartItemListProps) {
  const common = useTranslations("Common");
  const t = useTranslations("Cart");
  const { isLoading, removeItem, updateQuantity } = useCartStore();

  async function handleQuantityChange(item: CartItem, quantity: number) {
    const nextQuantity = Math.min(Math.max(quantity, 1), item.product.stock_quantity);

    try {
      await updateQuantity(item.id, nextQuantity);
      toast.success(t("updated"));
    } catch {
      toast.error(t("updateError"));
    }
  }

  async function handleRemove(itemId: number) {
    try {
      await removeItem(itemId);
      toast.success(t("removed"));
    } catch {
      toast.error(t("removeError"));
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const activePrice = item.product.discount_price ?? item.product.price;
        const isAtStockLimit = item.quantity >= item.product.stock_quantity;

        return (
          <article
            className="auto-card rounded-lg p-4"
            key={item.id}
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <Link
                  className="text-lg font-black text-white hover:text-red-200"
                  href={`/products/${item.product.slug}`}
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-zinc-500">
                  {common("sku")} {item.product.sku}
                </p>
                <p className="mt-3 text-sm font-semibold text-zinc-300">
                  {t("each", { price: formatCartPrice(activePrice) })}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {t("stock", { count: item.product.stock_quantity })}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <p className="text-lg font-black text-white">
                  {formatCartPrice(item.line_subtotal)}
                </p>
                <div className="grid h-10 w-32 grid-cols-[2.5rem_1fr_2.5rem] overflow-hidden rounded-md border border-white/10 bg-black/25">
                  <button
                    className="border-r border-white/10 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isLoading || item.quantity <= 1}
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    className="w-full bg-transparent text-center text-sm font-bold text-white outline-none"
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
                    className="border-l border-white/10 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isLoading || isAtStockLimit}
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                {isAtStockLimit ? (
                  <p className="text-xs font-semibold text-red-300">
                    {t("stockLimit")}
                  </p>
                ) : null}
                <button
                  className="text-sm font-semibold text-red-300 hover:text-red-100 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => handleRemove(item.id)}
                  type="button"
                >
                  {common("remove")}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
