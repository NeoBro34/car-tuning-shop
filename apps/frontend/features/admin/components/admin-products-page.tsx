"use client";

import axios from "axios";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import { ProductForm } from "@/features/admin/components/product-form";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  setAdminProductActive,
  updateAdminProduct,
  updateAdminProductStock,
  uploadAdminProductImages,
} from "@/features/admin/admin.service";
import type { AdminProductFormValues } from "@/features/admin/admin.schema";
import { getBrands, getCategories, type Brand, type Category, type Product } from "@/features/products";
import { formatPrice } from "@/features/products/product-format";

const PAGE_SIZE = 20;

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return `${fallback}: ${detail}`;
    }
  }

  return fallback;
}

function composeProductDescription(values: AdminProductFormValues) {
  const specs = (values.specifications ?? [])
    .filter((spec) => spec.key.trim() && spec.value.trim())
    .map((spec) => `- ${spec.key.trim()}: ${spec.value.trim()}`);

  return [
    values.short_description.trim(),
    `Full Description:\n${values.full_description.trim()}`,
    specs.length ? `Specifications:\n${specs.join("\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function getShortDescription(description: string) {
  return description.split("\n").find((line) => line.trim()) ?? "";
}

export function AdminProductsPage() {
  const admin = useTranslations("Admin");
  const common = useTranslations("Common");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const [productResponse, categoryResponse, brandResponse] = await Promise.all([
        getAdminProducts(PAGE_SIZE, 0),
        getCategories(),
        getBrands(),
      ]);

      setProducts(productResponse.items);
      setCategories(categoryResponse.items);
      setBrands(brandResponse.items);
    } catch {
      setError(admin("productsError"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function submitProduct(
    values: AdminProductFormValues,
    mainImageIndex?: number,
  ) {
    setIsSubmitting(true);

    try {
      const payload = {
        brand_id: values.brand_id,
        car_model_id: values.car_model_id || null,
        category_id: values.category_id,
        description: composeProductDescription(values),
        discount_price: values.discount_price || null,
        name: values.name,
        price: values.price,
        sku: values.sku,
        slug: values.slug || null,
        stock_quantity: values.stock_quantity,
      };

      if (editingProduct) {
        let updated = await updateAdminProduct(editingProduct.id, payload);
        if (updated.is_active !== values.is_active) {
          updated = await setAdminProductActive(updated.id, {
            is_active: values.is_active,
          });
        }
        if (values.images?.length) {
          try {
            updated = await uploadAdminProductImages(
              updated.id,
              values.images,
              mainImageIndex,
            );
          } catch (error) {
            toast.error(getApiErrorMessage(error, admin("imagesError")));
          }
        }
        setProducts((current) =>
          current.map((product) => (product.id === updated.id ? updated : product)),
        );
        setEditingProduct(null);
        toast.success(admin("updated"));
      } else {
        let created = await createAdminProduct(payload);
        if (!values.is_active) {
          created = await setAdminProductActive(created.id, { is_active: false });
        }
        if (values.images?.length) {
          try {
            created = await uploadAdminProductImages(
              created.id,
              values.images,
              mainImageIndex,
            );
          } catch (error) {
            toast.error(getApiErrorMessage(error, admin("imagesError")));
          }
        }
        setProducts((current) => [created, ...current]);
        toast.success(admin("saved"));
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, admin("saveError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateStock(product: Product, stock: number) {
    const previous = products;
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, stock_quantity: stock } : item,
      ),
    );

    try {
      const updated = await updateAdminProductStock(product.id, {
        stock_quantity: stock,
      });
      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(admin("stockUpdated"));
    } catch {
      setProducts(previous);
      toast.error(admin("stockError"));
    }
  }

  async function toggleActive(product: Product) {
    const nextActive = !product.is_active;
    const previous = products;
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, is_active: nextActive } : item,
      ),
    );

    try {
      await setAdminProductActive(product.id, { is_active: nextActive });
      toast.success(admin("statusUpdated"));
    } catch {
      setProducts(previous);
      toast.error(admin("statusError"));
    }
  }

  async function removeProduct(productId: number) {
    const previous = products;
    setProducts((current) => current.filter((product) => product.id !== productId));

    try {
      await deleteAdminProduct(productId);
      toast.success(admin("deleted"));
    } catch {
      setProducts(previous);
      toast.error(admin("deleteError"));
    }
  }

  async function uploadImages(product: Product, files: FileList | null) {
    if (!files?.length) {
      return;
    }

    try {
      const updated = await uploadAdminProductImages(product.id, files);
      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(admin("imagesUploaded"));
    } catch (error) {
      toast.error(getApiErrorMessage(error, admin("imagesError")));
    }
  }

  const productFormDefaults = useMemo(
    () =>
      editingProduct
        ? {
            brand_id: editingProduct.brand_id,
            car_model_id: editingProduct.car_model_id ?? 0,
            category_id: editingProduct.category_id,
            discount_price: editingProduct.discount_price?.toString() ?? "",
            full_description: editingProduct.description,
            images: [],
            is_active: editingProduct.is_active,
            name: editingProduct.name,
            price: editingProduct.price.toString(),
            short_description: getShortDescription(editingProduct.description),
            sku: editingProduct.sku,
            slug: editingProduct.slug,
            specifications: [{ key: "", value: "" }],
            stock_quantity: editingProduct.stock_quantity,
          }
        : undefined,
    [editingProduct],
  );

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      { accessorKey: "name", header: common("product") },
      { accessorKey: "sku", header: common("sku") },
      {
        header: common("price"),
        cell: ({ row }) => formatPrice(row.original.discount_price ?? row.original.price),
      },
      {
        header: common("stock"),
        cell: ({ row }) => (
          <Input
            min="0"
            onBlur={(event) => updateStock(row.original, Number(event.target.value))}
            type="number"
            defaultValue={row.original.stock_quantity}
          />
        ),
      },
      {
        header: admin("status"),
        cell: ({ row }) => (
          <Button
            onClick={() => toggleActive(row.original)}
            type="button"
            variant={row.original.is_active ? "secondary" : "danger"}
          >
            {row.original.is_active ? admin("active") : admin("inactive")}
          </Button>
        ),
      },
      {
        header: admin("images"),
        cell: ({ row }) => (
          <Input
            accept="image/*"
            multiple
            onChange={(event) => uploadImages(row.original, event.target.files)}
            type="file"
          />
        ),
      },
      {
        header: common("actions"),
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              onClick={() => setEditingProduct(row.original)}
              type="button"
              variant="secondary"
            >
              {common("edit")}
            </Button>
            <Button
              onClick={() => removeProduct(row.original.id)}
              type="button"
              variant="danger"
            >
              {common("delete")}
            </Button>
          </div>
        ),
      },
    ],
    [products],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-black text-white">
            {editingProduct ? admin("updateProduct") : admin("createProduct")}
          </h2>
        </CardHeader>
        <CardContent>
          <ProductForm
            brands={brands}
            categories={categories}
            defaultValues={productFormDefaults}
            isSubmitting={isSubmitting}
            onSubmit={submitProduct}
            submitLabel={editingProduct ? admin("updateProduct") : admin("createProduct")}
          />
          {editingProduct ? (
            <Button className="mt-3" onClick={() => setEditingProduct(null)} type="button" variant="ghost">
              {admin("cancelEditing")}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-black text-white">{admin("products")}</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="h-64 animate-pulse rounded-md bg-white/10" /> : null}
          {!isLoading && error ? (
            <div className="rounded-md border border-red-400/30 bg-red-950/40 p-4 text-red-200">
              {error}
            </div>
          ) : null}
          {!isLoading && !error ? (
            <AdminDataTable columns={columns} data={products} emptyLabel={admin("noProducts")} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
