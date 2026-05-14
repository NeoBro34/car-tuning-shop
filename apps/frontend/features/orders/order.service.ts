import { apiClient } from "@/services/api-client";
import type { Order, OrderCreatePayload } from "@/types/order";

export async function createOrder(payload: OrderCreatePayload) {
  const response = await apiClient.post<Order>("/orders", payload);

  return response.data;
}
