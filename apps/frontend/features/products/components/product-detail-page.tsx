"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeft, BadgeCheck, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const common = useTranslations("Common");
  const t = useTranslations("ProductDetail");
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
          setError(t("loadError"));
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
  }, [slug, t]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-white/10" />
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="aspect-square animate-pulse rounded-lg bg-white/10" />
          <div className="h-[30rem] animate-pulse rounded-lg bg-white/10" />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm font-semibold text-red-300" href="/products">
          {common("backToProducts")}
        </Link>
        <div className="mt-6 rounded-lg border border-red-400/30 bg-red-950/40 p-6">
          <h1 className="font-bold text-red-100">{t("loadErrorTitle")}</h1>
          <p className="mt-2 text-sm leading-6 text-red-200">
            {error ?? t("notFound")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        className="inline-flex items-center gap-2 text-sm font-bold text-red-300 transition hover:text-red-100"
        href="/products"
      >
        <ArrowLeft className="size-4" />
        {common("backToProducts")}
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

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="auto-card rounded-lg p-5">
          <BadgeCheck className="size-6 text-red-300" />
          <h2 className="mt-4 text-lg font-black text-white">{t("specs")}</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <p className="flex justify-between gap-4 border-b border-white/10 pb-3 text-zinc-400">
              <span>SKU</span>
              <span className="font-bold text-white">{product.sku}</span>
            </p>
            <p className="flex justify-between gap-4 border-b border-white/10 pb-3 text-zinc-400">
              <span>{common("category")}</span>
              <span className="font-bold text-white">
                {categoryById.get(product.category_id)?.name ??
                  `#${product.category_id}`}
              </span>
            </p>
            <p className="flex justify-between gap-4 text-zinc-400">
              <span>{common("brand")}</span>
              <span className="font-bold text-white">
                {brandById.get(product.brand_id)?.name ?? `#${product.brand_id}`}
              </span>
            </p>
          </div>
        </section>
        <section className="auto-card rounded-lg p-5">
          <ShieldCheck className="size-6 text-orange-300" />
          <h2 className="mt-4 text-lg font-black text-white">
            {t("compatibility")}
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            {t("compatibilityText")}
          </p>
        </section>
        <section className="auto-card rounded-lg p-5">
          <Truck className="size-6 text-emerald-300" />
          <h2 className="mt-4 text-lg font-black text-white">
            {t("deliveryInfo")}
          </h2>
          <div className="mt-4 space-y-3 text-sm font-semibold text-zinc-400">
            <p className="flex items-center gap-2">
              <PackageCheck className="size-4 text-red-300" />
              {t("packed")}
            </p>
            <p>{t("stockVisible", { count: product.stock_quantity })}</p>
          </div>
        </section>
      </div>

      <RelatedProducts
        brands={brands}
        categories={categories}
        products={relatedProducts}
      />
    </section>
  );
}
