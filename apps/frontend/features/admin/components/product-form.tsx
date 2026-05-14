"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  adminProductSchema,
  type AdminProductFormValues,
} from "@/features/admin/admin.schema";
import type { Brand, Category } from "@/features/products";

type ProductFormProps = {
  brands: Brand[];
  categories: Category[];
  defaultValues?: Partial<AdminProductFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: AdminProductFormValues) => Promise<void>;
  submitLabel: string;
};

export function ProductForm({
  brands,
  categories,
  defaultValues,
  isSubmitting = false,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<AdminProductFormValues>({
    defaultValues: {
      brand_id: 0,
      category_id: 0,
      description: "",
      discount_price: "",
      name: "",
      price: "",
      sku: "",
      slug: "",
      stock_quantity: 0,
      ...defaultValues,
    },
    resolver: zodResolver(adminProductSchema),
  });

  async function submit(values: AdminProductFormValues) {
    await onSubmit(values);

    if (!defaultValues) {
      reset();
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Name</span>
        <Input className="mt-2" {...register("name")} />
        {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Slug</span>
        <Input className="mt-2" {...register("slug")} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">SKU</span>
        <Input className="mt-2" {...register("sku")} />
        {errors.sku ? <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p> : null}
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Stock</span>
        <Input
          className="mt-2"
          type="number"
          {...register("stock_quantity", { valueAsNumber: true })}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Price</span>
        <Input className="mt-2" type="number" step="0.01" {...register("price")} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Discount price</span>
        <Input
          className="mt-2"
          type="number"
          step="0.01"
          {...register("discount_price")}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Category</span>
        <Select
          className="mt-2"
          {...register("category_id", { valueAsNumber: true })}
        >
          <option value={0}>Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-zinc-700">Brand</span>
        <Select className="mt-2" {...register("brand_id", { valueAsNumber: true })}>
          <option value={0}>Select brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block md:col-span-2">
        <span className="text-sm font-semibold text-zinc-700">Description</span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          {...register("description")}
        />
      </label>
      <div className="md:col-span-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
