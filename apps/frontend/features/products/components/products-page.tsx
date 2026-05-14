"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductGrid } from "@/features/products/components/product-grid";
import { Pagination } from "@/features/products/components/pagination";
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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<ListMeta>(initialMeta);
  const [products, setProducts] = useState<Product[]>([]);

  const params = useMemo(
    () => buildProductParams(filters, currentPage),
    [currentPage, filters],
  );

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
          setError("Products could not be loaded. Check the backend API.");
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
  }, [params]);

  function handleFilterChange(nextFilters: ProductFiltersState) {
    setFilters(nextFilters);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setFilters(initialFilters);
    setCurrentPage(1);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          Catalog
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Products
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600">
          Browse tuning parts with search, filters, pagination, and API-backed
          product data.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ProductFilters
          brands={brands}
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="space-y-6">
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-zinc-700">
              {meta.total} products found
            </p>
            <p className="text-sm text-zinc-500">
              Showing {products.length} items
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div
                  className="h-96 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100"
                  key={index}
                />
              ))}
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <h2 className="font-bold text-red-900">Unable to load products</h2>
              <p className="mt-2 text-sm leading-6 text-red-700">{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && products.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-zinc-950">
                No products found
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Adjust search or filters to see more tuning parts.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && products.length > 0 ? (
            <>
              <ProductGrid
                brands={brands}
                categories={categories}
                products={products}
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
