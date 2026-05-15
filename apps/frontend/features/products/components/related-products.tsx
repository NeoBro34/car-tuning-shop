"use client";

import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";
import { ProductGrid } from "@/features/products/components/product-grid";
import { useTranslations } from "next-intl";

type RelatedProductsProps = {
  brands: Brand[];
  categories: Category[];
  products: Product[];
};

export function RelatedProducts({
  brands,
  categories,
  products,
}: RelatedProductsProps) {
  const t = useTranslations("ProductDetail");

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
            {t("moreParts")}
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            {t("related")}
          </h2>
        </div>
      </div>

      {products.length > 0 ? (
        <ProductGrid brands={brands} categories={categories} products={products} />
      ) : (
        <div className="auto-card rounded-lg p-6 text-sm text-zinc-400">
          {t("noRelated")}
        </div>
      )}
    </section>
  );
}
