"use client";

import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";
import { ProductGrid } from "@/features/products/components/product-grid";

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
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            More parts
          </p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-950">
            Related products
          </h2>
        </div>
      </div>

      {products.length > 0 ? (
        <ProductGrid brands={brands} categories={categories} products={products} />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-600 shadow-sm">
          No related products found.
        </div>
      )}
    </section>
  );
}
