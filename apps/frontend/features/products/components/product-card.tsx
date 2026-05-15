"use client";

import { Link } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";
import {
  formatPrice,
  getDiscountPercentage,
} from "@/features/products/product-format";
import { useCartStore } from "@/store/cart-store";

type ProductCardProps = {
  product: Product;
  category?: Category;
  brand?: Brand;
};

export function ProductCard({ product, category, brand }: ProductCardProps) {
  const common = useTranslations("Common");
  const t = useTranslations("Products");
  const mainImage =
    product.images.find((image) => image.is_main) ?? product.images[0];
  const activePrice = product.discount_price ?? product.price;
  const addItem = useCartStore((state) => state.addItem);
  const discount = getDiscountPercentage(product.price, product.discount_price);
  const isOutOfStock = product.stock_quantity <= 0;

  async function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    try {
      await addItem(product, 1);
      toast.success(t("added"));
    } catch {
      toast.error(t("addError"));
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-950/82 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-red-400/45">
      <Link
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-900"
        href={`/products/${product.slug}`}
      >
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            src={mainImage.image_url}
          />
        ) : (
          <span className="px-4 text-center text-sm font-semibold text-zinc-500">
            {t("productImage")}
          </span>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {discount ? (
            <span className="rounded bg-red-500 px-2 py-1 text-xs font-black text-white">
              -{discount}%
            </span>
          ) : null}
          <span
            className={`rounded px-2 py-1 text-xs font-black ${
              isOutOfStock
                ? "bg-zinc-800 text-zinc-300"
                : "bg-emerald-400 text-zinc-950"
            }`}
          >
            {isOutOfStock ? t("out") : common("inStock")}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2 text-xs font-bold text-zinc-400">
          <span className="rounded bg-white/[0.06] px-2 py-1">
            {category?.name ?? `${common("category")} #${product.category_id}`}
          </span>
          <span className="rounded bg-white/[0.06] px-2 py-1">
            {brand?.name ?? `${common("brand")} #${product.brand_id}`}
          </span>
        </div>
        <Link
          className="mt-3 line-clamp-2 text-lg font-black text-white hover:text-red-200"
          href={`/products/${product.slug}`}
        >
          {product.name}
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-black text-white">
              {formatPrice(activePrice)}
            </p>
            {product.discount_price ? (
              <p className="text-sm text-zinc-500 line-through">
                {formatPrice(product.price)}
              </p>
            ) : null}
          </div>
          <p className="text-sm font-bold text-zinc-400">
            {t("left", { count: product.stock_quantity })}
          </p>
        </div>
        <button
          className="btn-primary mt-5 w-full gap-2 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          type="button"
        >
          <ShoppingCart className="size-4" />
          {isOutOfStock ? t("outOfStock") : common("addToCart")}
        </button>
      </div>
    </article>
  );
}
