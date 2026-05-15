"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";
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

function ProductCardComponent({ product, category, brand }: ProductCardProps) {
  const common = useTranslations("Common");
  const t = useTranslations("Products");
  const shouldReduceMotion = useReducedMotion();
  const mainImage =
    product.images.find((image) => image.is_main) ?? product.images[0];
  const activePrice = product.discount_price ?? product.price;
  const addItem = useCartStore((state) => state.addItem);
  const discount = getDiscountPercentage(product.price, product.discount_price);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = useCallback(async () => {
    if (isOutOfStock) {
      return;
    }

    try {
      await addItem(product, 1);
      toast.success(t("added"));
    } catch {
      toast.error(t("addError"));
    }
  }, [addItem, isOutOfStock, product, t]);

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-950/82 shadow-xl shadow-black/20 transition hover:border-red-400/45"
      transition={{ duration: 0.18, ease: "easeOut" }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
    >
      <Link
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-900"
        href={`/products/${product.slug}`}
      >
        {mainImage ? (
          <Image
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
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
        <motion.button
          whileTap={isOutOfStock || shouldReduceMotion ? undefined : { scale: 0.98 }}
          whileHover={isOutOfStock || shouldReduceMotion ? undefined : { scale: 1.01 }}
          className="btn-primary mt-5 w-full gap-2 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          type="button"
        >
          <ShoppingCart className="size-4 transition group-hover:rotate-[-6deg]" />
          {isOutOfStock ? t("outOfStock") : common("addToCart")}
        </motion.button>
      </div>
    </motion.article>
  );
}

export const ProductCard = memo(ProductCardComponent);
