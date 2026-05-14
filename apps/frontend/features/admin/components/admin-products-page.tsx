"use client";

import type { ColumnDef } from "@tanstack/react-table";
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

export function AdminProductsPage() {
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
      setError("Products could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function submitProduct(values: AdminProductFormValues) {
    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        discount_price: values.discount_price || null,
        slug: values.slug || null,
      };

      if (editingProduct) {
        const updated = await updateAdminProduct(editingProduct.id, payload);
        setProducts((current) =>
          current.map((product) => (product.id === updated.id ? updated : product)),
        );
        setEditingProduct(null);
        toast.success("Product updated");
      } else {
        const created = await createAdminProduct(payload);
        setProducts((current) => [created, ...current]);
        toast.success("Product created");
      }
    } catch {
      toast.error("Could not save product");
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
      toast.success("Stock updated");
    } catch {
      setProducts(previous);
      toast.error("Could not update stock");
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
      toast.success("Product status updated");
    } catch {
      setProducts(previous);
      toast.error("Could not update product status");
    }
  }

  async function removeProduct(productId: number) {
    const previous = products;
    setProducts((current) => current.filter((product) => product.id !== productId));

    try {
      await deleteAdminProduct(productId);
      toast.success("Product deleted");
    } catch {
      setProducts(previous);
      toast.error("Could not delete product");
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
      toast.success("Images uploaded");
    } catch {
      toast.error("Could not upload images");
    }
  }

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      { accessorKey: "name", header: "Product" },
      { accessorKey: "sku", header: "SKU" },
      {
        header: "Price",
        cell: ({ row }) => formatPrice(row.original.discount_price ?? row.original.price),
      },
      {
        header: "Stock",
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
        header: "Status",
        cell: ({ row }) => (
          <Button
            onClick={() => toggleActive(row.original)}
            type="button"
            variant={row.original.is_active ? "secondary" : "danger"}
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </Button>
        ),
      },
      {
        header: "Images",
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
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              onClick={() => setEditingProduct(row.original)}
              type="button"
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              onClick={() => removeProduct(row.original.id)}
              type="button"
              variant="danger"
            >
              Delete
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
          <h2 className="text-lg font-bold text-zinc-950">
            {editingProduct ? "Update product" : "Create product"}
          </h2>
        </CardHeader>
        <CardContent>
          <ProductForm
            brands={brands}
            categories={categories}
            defaultValues={
              editingProduct
                ? {
                    brand_id: editingProduct.brand_id,
                    category_id: editingProduct.category_id,
                    description: editingProduct.description,
                    discount_price: editingProduct.discount_price?.toString() ?? "",
                    name: editingProduct.name,
                    price: editingProduct.price.toString(),
                    sku: editingProduct.sku,
                    slug: editingProduct.slug,
                    stock_quantity: editingProduct.stock_quantity,
                  }
                : undefined
            }
            isSubmitting={isSubmitting}
            onSubmit={submitProduct}
            submitLabel={editingProduct ? "Update product" : "Create product"}
          />
          {editingProduct ? (
            <Button className="mt-3" onClick={() => setEditingProduct(null)} type="button" variant="ghost">
              Cancel editing
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold text-zinc-950">Products</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="h-64 animate-pulse rounded-md bg-zinc-100" /> : null}
          {!isLoading && error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : null}
          {!isLoading && !error ? (
            <AdminDataTable columns={columns} data={products} emptyLabel="No products found." />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
