"use client";

import { Search, SlidersHorizontal } from "lucide-react";
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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFiltersState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<ListMeta>(initialMeta);
  const [products, setProducts] = useState<Product[]>([]);
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
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
            Catalog
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-normal text-white sm:text-5xl">
            Performance parts
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">
            Search, filter, and compare tuning parts with live API-backed
            product data.
          </p>
        </div>
        <div className="auto-card flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-zinc-300">
          <Search className="size-4 text-red-300" />
          {meta.total} products matched
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <ProductFilters
          brands={brands}
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="space-y-6">
          <div className="auto-card flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-red-500/15 text-red-200">
                <SlidersHorizontal className="size-5" />
              </span>
              <div>
                <p className="text-sm font-black text-white">
                  {meta.total} products found
                </p>
                <p className="text-xs font-semibold text-zinc-500">
                  Showing {products.length} items on this page
                </p>
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm font-bold text-zinc-400">
              Sort
              <select
                className="auto-input h-10 rounded-md px-3 text-sm font-bold"
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                value={sortBy}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="stock-desc">Stock: highest</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div
                  className="h-96 animate-pulse rounded-lg border border-white/10 bg-white/[0.06]"
                  key={index}
                />
              ))}
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-lg border border-red-400/30 bg-red-950/40 p-6">
              <h2 className="font-bold text-red-100">Unable to load products</h2>
              <p className="mt-2 text-sm leading-6 text-red-200">{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && products.length === 0 ? (
            <div className="auto-card rounded-lg p-8 text-center">
              <h2 className="text-xl font-bold text-white">
                No products found
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Adjust search or filters to see more tuning parts.
              </p>
            </div>
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
