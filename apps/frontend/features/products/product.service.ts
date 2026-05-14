import { apiClient } from "@/services/api-client";
import type {
  Brand,
  Category,
  ListResponse,
  Product,
  ProductQueryParams,
} from "@/features/products/product.types";

export async function getProducts(params: ProductQueryParams) {
  const response = await apiClient.get<ListResponse<Product>>("/products", {
    params,
  });

  return response.data;
}

export async function getProductBySlug(slug: string) {
  try {
    const response = await apiClient.get<Product>(
      `/products/${encodeURIComponent(slug)}`,
    );

    return response.data;
  } catch (error) {
    const response = await apiClient.get<Product>(
      `/products/slug/${encodeURIComponent(slug)}`,
    );

    return response.data;
  }
}

export async function getRelatedProducts(product: Product) {
  return getProducts({
    limit: 4,
    offset: 0,
    category_id: product.category_id,
  });
}

export async function getCategories() {
  const response = await apiClient.get<ListResponse<Category>>("/categories", {
    params: { limit: 100, offset: 0 },
  });

  return response.data;
}

export async function getBrands() {
  const response = await apiClient.get<ListResponse<Brand>>("/brands", {
    params: { limit: 100, offset: 0 },
  });

  return response.data;
}
