"use client";

import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ProductGrid } from "@/features/products/components/product-grid";
import { Pagination } from "@/features/products/components/pagination";
import {
  PaginationSkeleton,
  ProductFiltersSkeleton,
  ProductGridSkeleton,
} from "@/features/products/components/product-skeletons";
import {
  getBrands,
  getCategories,
  getProducts,
} from "@/features/products/product.service";
import type {
  Brand,
  Category,
  ListMeta,
  Product,
  ProductFilters as ProductFiltersState,
  ProductQueryParams,
} from "@/features/products/product.types";

const PAGE_SIZE = 9;

const ProductFilters = dynamic(
  () =>
    import("@/features/products/components/product-filters").then(
      (module) => module.ProductFilters,
    ),
  {
    loading: () => <ProductFiltersSkeleton />,
  },
);

const initialFilters: ProductFiltersState = {
  search: "",
  categoryId: "",
  brandId: "",
  minPrice: "",
  maxPrice: "",
};

const initialMeta: ListMeta = {
  total: 0,
  limit: PAGE_SIZE,
  offset: 0,
};

type SortOption = "featured" | "price-asc" | "price-desc" | "stock-desc";

function buildProductParams(
  filters: ProductFiltersState,
  currentPage: number,
): ProductQueryParams {
  return {
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
    search: filters.search.trim() || undefined,
    category_id: filters.categoryId ? Number(filters.categoryId) : undefined,
    brand_id: filters.brandId ? Number(filters.brandId) : undefined,
    min_price: filters.minPrice || undefined,
    max_price: filters.maxPrice || undefined,
  };
}

export function ProductsPage() {
  const t = useTranslations("Products");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<ListMeta>(initialMeta);
  const [products, setProducts] = useState<Product[]>([]);
  const [retryKey, setRetryKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const params = useMemo(
    () => buildProductParams(filters, currentPage),
    [currentPage, filters],
  );

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sortBy === "price-asc") {
      return items.sort(
        (left, right) =>
          Number(left.discount_price ?? left.price) -
          Number(right.discount_price ?? right.price),
      );
    }

    if (sortBy === "price-desc") {
      return items.sort(
        (left, right) =>
          Number(right.discount_price ?? right.price) -
          Number(left.discount_price ?? left.price),
      );
    }

    if (sortBy === "stock-desc") {
      return items.sort(
        (left, right) => right.stock_quantity - left.stock_quantity,
      );
    }

    return items;
  }, [products, sortBy]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const [productsResponse, categoriesResponse, brandsResponse] =
          await Promise.all([
            getProducts(params),
            getCategories(),
            getBrands(),
          ]);

        if (controller.signal.aborted) {
          return;
        }

        setProducts(productsResponse.items);
        setMeta(productsResponse.meta);
        setCategories(categoriesResponse.items);
        setBrands(brandsResponse.items);
      } catch {
        if (!controller.signal.aborted) {
          setError(t("loadingError"));
          setProducts([]);
          setMeta(initialMeta);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [params, retryKey, t]);

  const handleFilterChange = useCallback((nextFilters: ProductFiltersState) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);

  return (
    <section className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-normal text-white sm:text-5xl">
            {t("headline")}
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">
            {t("description")}
          </p>
        </div>
        <div className="auto-card flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-zinc-300">
          <Search className="size-4 text-red-300" />
          {t("matched", { count: meta.total })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {isLoading && categories.length === 0 && brands.length === 0 ? (
          <ProductFiltersSkeleton />
        ) : (
          <ProductFilters
            brands={brands}
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        )}

        <div className="space-y-6">
          <div className="auto-card flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-red-500/15 text-red-200">
                <SlidersHorizontal className="size-5" />
              </span>
              <div>
                <p className="text-sm font-black text-white">
                  {t("found", { count: meta.total })}
                </p>
                <p className="text-xs font-semibold text-zinc-500">
                  {t("showing", { count: products.length })}
                </p>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-bold text-zinc-400">
              {t("sort")}
              <select
                className="auto-input h-10 rounded-md px-3 text-sm font-bold"
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                value={sortBy}
              >
                <option value="featured">{t("sortFeatured")}</option>
                <option value="price-asc">{t("sortPriceAsc")}</option>
                <option value="price-desc">{t("sortPriceDesc")}</option>
                <option value="stock-desc">{t("sortStockDesc")}</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <>
              <ProductGridSkeleton count={PAGE_SIZE} />
              <PaginationSkeleton />
            </>
          ) : null}

          {!isLoading && error ? (
            <ErrorState
              description={error}
              onRetry={() => setRetryKey((value) => value + 1)}
              title={t("loadingErrorTitle")}
            />
          ) : null}

          {!isLoading && !error && products.length === 0 ? (
            <EmptyState
              description={t("emptyDescription")}
              icon={<PackageSearch aria-hidden="true" className="size-6" />}
              title={t("emptyTitle")}
            />
          ) : null}

          {!isLoading && !error && products.length > 0 ? (
            <>
              <ProductGrid
                brands={brands}
                categories={categories}
                products={sortedProducts}
              />
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                total={meta.total}
              />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
