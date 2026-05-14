"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductInfo } from "@/features/products/components/product-info";
import { RelatedProducts } from "@/features/products/components/related-products";
import {
  getBrands,
  getCategories,
  getProductBySlug,
  getRelatedProducts,
} from "@/features/products/product.service";
import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";

type ProductDetailPageProps = {
  slug: string;
};

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  );
  const brandById = useMemo(
    () => new Map(brands.map((brand) => [brand.id, brand])),
    [brands],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const [productResponse, categoriesResponse, brandsResponse] =
          await Promise.all([getProductBySlug(slug), getCategories(), getBrands()]);

        if (controller.signal.aborted) {
          return;
        }

        setProduct(productResponse);
        setCategories(categoriesResponse.items);
        setBrands(brandsResponse.items);
        setQuantity(productResponse.stock_quantity > 0 ? 1 : 0);

        const relatedResponse = await getRelatedProducts(productResponse);

        if (!controller.signal.aborted) {
          setRelatedProducts(
            relatedResponse.items
              .filter((item) => item.id !== productResponse.id)
              .slice(0, 3),
          );
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Product could not be loaded. Check the backend API.");
          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [slug]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="aspect-square animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-[30rem] animate-pulse rounded-lg bg-zinc-100" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm font-semibold text-red-600" href="/products">
          Back to products
        </Link>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="font-bold text-red-900">Unable to load product</h1>
          <p className="mt-2 text-sm leading-6 text-red-700">
            {error ?? "Product not found."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link className="text-sm font-semibold text-red-600" href="/products">
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo
          brand={brandById.get(product.brand_id)}
          category={categoryById.get(product.category_id)}
          onQuantityChange={setQuantity}
          product={product}
          quantity={quantity}
        />
      </div>

      <RelatedProducts
        brands={brands}
        categories={categories}
        products={relatedProducts}
      />
    </section>
  );
}
