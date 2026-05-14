"use client";

import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";
import { ProductCard } from "@/features/products/components/product-card";

type ProductGridProps = {
  brands: Brand[];
  categories: Category[];
  products: Product[];
};

export function ProductGrid({ brands, categories, products }: ProductGridProps) {
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const brandById = new Map(brands.map((brand) => [brand.id, brand]));

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          brand={brandById.get(product.brand_id)}
          category={categoryById.get(product.category_id)}
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
