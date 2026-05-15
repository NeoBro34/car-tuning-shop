"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const brandById = new Map(brands.map((brand) => [brand.id, brand]));

  return (
    <motion.div
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : 0.045,
          },
        },
      }}
      viewport={{ once: true, amount: 0.12 }}
      whileInView="show"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ProductCard
            brand={brandById.get(product.brand_id)}
            category={categoryById.get(product.category_id)}
            product={product}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
