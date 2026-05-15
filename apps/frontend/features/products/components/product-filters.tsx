"use client";

import { RotateCcw, Search } from "lucide-react";
import type {
  Brand,
  Category,
  ProductFilters as ProductFiltersState,
} from "@/features/products/product.types";

type ProductFiltersProps = {
  brands: Brand[];
  categories: Category[];
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
};

export function ProductFilters({
  brands,
  categories,
  filters,
  onChange,
  onReset,
}: ProductFiltersProps) {
  function updateFilter(name: keyof ProductFiltersState, value: string) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <aside className="auto-card rounded-lg p-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black uppercase tracking-wide text-white">
          Filters
        </h2>
        <button
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-bold text-red-300 transition hover:bg-red-500/10 hover:text-red-100"
          onClick={onReset}
          type="button"
        >
          <RotateCcw className="size-4" />
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-zinc-300">Search</span>
          <span className="relative mt-2 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            className="auto-input w-full rounded-md py-2 pl-9 pr-3 text-sm"
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search products"
            type="search"
            value={filters.search}
          />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-zinc-300">Category</span>
          <select
            className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
            onChange={(event) => updateFilter("categoryId", event.target.value)}
            value={filters.categoryId}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-zinc-300">Brand</span>
          <select
            className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
            onChange={(event) => updateFilter("brandId", event.target.value)}
            value={filters.brandId}
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">Min price</span>
            <input
              className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
              min="0"
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              placeholder="0"
              type="number"
              value={filters.minPrice}
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-zinc-300">Max price</span>
            <input
              className="auto-input mt-2 w-full rounded-md px-3 py-2 text-sm"
              min="0"
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              placeholder="5000"
              type="number"
              value={filters.maxPrice}
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
