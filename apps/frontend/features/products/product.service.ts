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
