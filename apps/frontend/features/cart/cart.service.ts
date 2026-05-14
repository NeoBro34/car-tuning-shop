import { apiClient } from "@/services/api-client";
import type {
  AddCartItemPayload,
  CartResponse,
  UpdateCartItemPayload,
} from "@/types/cart";

export async function getCart() {
  const response = await apiClient.get<CartResponse>("/cart/");

  return response.data;
}

export async function addCartItem(payload: AddCartItemPayload) {
  const response = await apiClient.post<CartResponse>("/cart/add", payload);

  return response.data;
}

export async function updateCartItem(
  itemId: number,
  payload: UpdateCartItemPayload,
) {
  const response = await apiClient.put<CartResponse>(`/cart/${itemId}`, payload);

  return response.data;
}

export async function removeCartItem(itemId: number) {
  const response = await apiClient.delete<CartResponse>(`/cart/${itemId}`);

  return response.data;
}
