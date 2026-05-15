"use client";

import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { QuantitySelector } from "@/features/products/components/quantity-selector";
import {
  formatPrice,
  getDiscountPercentage,
} from "@/features/products/product-format";
import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";
import { useCartStore } from "@/store/cart-store";

type ProductInfoProps = {
  brand?: Brand;
  category?: Category;
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

export function ProductInfo({
  brand,
  category,
  product,
  quantity,
  onQuantityChange,
}: ProductInfoProps) {
  const common = useTranslations("Common");
  const t = useTranslations("ProductDetail");
  const addItem = useCartStore((state) => state.addItem);
  const discountPercentage = getDiscountPercentage(
    product.price,
    product.discount_price,
  );
  const isOutOfStock = product.stock_quantity <= 0;
  const activePrice = product.discount_price ?? product.price;

  async function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    try {
      await addItem(product, quantity);
      toast.success(t("added"));
    } catch {
      toast.error(t("addError"));
    }
  }

  return (
    <section className="auto-card rounded-lg p-5 sm:p-6 lg:sticky lg:top-24">
      <div className="flex flex-wrap gap-2 text-xs font-bold text-zinc-400">
        <span className="rounded bg-white/[0.06] px-2 py-1">
          {category?.name ?? `${common("category")} #${product.category_id}`}
        </span>
        <span className="rounded bg-white/[0.06] px-2 py-1">
          {brand?.name ?? `${common("brand")} #${product.brand_id}`}
        </span>
        <span className="rounded bg-white/[0.06] px-2 py-1">SKU {product.sku}</span>
      </div>

      <h1 className="mt-4 text-3xl font-black uppercase tracking-normal text-white sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-black text-white">
          {formatPrice(activePrice)}
        </p>
        {product.discount_price ? (
          <>
            <p className="pb-1 text-lg font-semibold text-zinc-500 line-through">
              {formatPrice(product.price)}
            </p>
            {discountPercentage ? (
              <p className="mb-1 rounded bg-red-500 px-2 py-1 text-sm font-black text-white">
                {t("discount", { percent: discountPercentage })}
              </p>
            ) : null}
          </>
        ) : null}
      </div>

      <p
        className={`mt-4 text-sm font-bold ${
          isOutOfStock ? "text-red-300" : "text-emerald-300"
        }`}
      >
        {isOutOfStock
          ? common("outOfStock")
          : t("stockCount", { count: product.stock_quantity })}
      </p>

      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-400">
        {product.description}
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <QuantitySelector
          max={product.stock_quantity}
          onChange={onQuantityChange}
          value={quantity}
        />
        <button
          className="btn-primary min-h-11 flex-1 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          type="button"
        >
          {isOutOfStock ? common("outOfStock") : common("addToCart")}
        </button>
      </div>
    </section>
  );
}
