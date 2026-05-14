import { apiClient } from "@/services/api-client";
import type { Product } from "@/types/product";

export async function getProducts() {
  const response = await apiClient.get<Product[]>("/products");

  return response.data;
}
