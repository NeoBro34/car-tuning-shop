"use client";

import toast from "react-hot-toast";
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
  const addItem = useCartStore((state) => state.addItem);
  const discountPercentage = getDiscountPercentage(
    product.price,
    product.discount_price,
  );
  const isOutOfStock = product.stock_quantity <= 0;
  const activePrice = product.discount_price ?? product.price;

  function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    addItem(product, quantity);
    toast.success("Product added to cart");
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
        <span className="rounded-md bg-zinc-100 px-2 py-1">
          {category?.name ?? `Category #${product.category_id}`}
        </span>
        <span className="rounded-md bg-zinc-100 px-2 py-1">
          {brand?.name ?? `Brand #${product.brand_id}`}
        </span>
        <span className="rounded-md bg-zinc-100 px-2 py-1">SKU {product.sku}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <p className="text-3xl font-black text-zinc-950">
          {formatPrice(activePrice)}
        </p>
        {product.discount_price ? (
          <>
            <p className="pb-1 text-lg font-semibold text-zinc-500 line-through">
              {formatPrice(product.price)}
            </p>
            {discountPercentage ? (
              <p className="mb-1 rounded-md bg-red-100 px-2 py-1 text-sm font-bold text-red-700">
                {discountPercentage}% off
              </p>
            ) : null}
          </>
        ) : null}
      </div>

      <p
        className={`mt-4 text-sm font-bold ${
          isOutOfStock ? "text-red-700" : "text-emerald-700"
        }`}
      >
        {isOutOfStock ? "Out of stock" : `${product.stock_quantity} in stock`}
      </p>

      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-zinc-600">
        {product.description}
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <QuantitySelector
          max={product.stock_quantity}
          onChange={onQuantityChange}
          value={quantity}
        />
        <button
          className="btn-primary min-h-11 flex-1 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          type="button"
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </section>
  );
}
