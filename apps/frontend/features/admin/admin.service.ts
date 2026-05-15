import { apiClient } from "@/services/api-client";
import type {
  AdminDashboard,
  AdminListResponse,
  AdminOrder,
  AdminOrderStatusPayload,
  AdminProduct,
  AdminProductActivePayload,
  AdminProductPayload,
  AdminProductStockPayload,
  AdminProductUpdatePayload,
  AdminUser,
} from "@/features/admin/admin.types";
import type { ListResponse, Product } from "@/features/products";

export async function getAdminDashboard() {
  const response = await apiClient.get<AdminDashboard>("/admin/dashboard");

  return response.data;
}

export async function getAdminUsers(limit = 20, offset = 0) {
  const response = await apiClient.get<AdminListResponse<AdminUser>>(
    "/admin/users",
    { params: { limit, offset } },
  );

  return response.data;
}

export async function blockAdminUser(userId: number) {
  const response = await apiClient.put<AdminUser>(`/admin/users/${userId}/block`);

  return response.data;
}

export async function unblockAdminUser(userId: number) {
  const response = await apiClient.put<AdminUser>(
    `/admin/users/${userId}/unblock`,
  );

  return response.data;
}

export async function getAdminOrders(limit = 20, offset = 0) {
  const response = await apiClient.get<AdminListResponse<AdminOrder>>(
    "/admin/orders",
    { params: { limit, offset } },
  );

  return response.data;
}

export async function updateAdminOrderStatus(
  orderId: number,
  payload: AdminOrderStatusPayload,
) {
  const response = await apiClient.put<AdminOrder>(
    `/admin/orders/${orderId}/status`,
    payload,
  );

  return response.data;
}

export async function getAdminProducts(limit = 20, offset = 0) {
  const response = await apiClient.get<ListResponse<Product>>("/products", {
    params: { limit, offset },
  });

  return response.data;
}

export async function createAdminProduct(payload: AdminProductPayload) {
  const response = await apiClient.post<AdminProduct>("/products", payload);

  return response.data;
}

export async function updateAdminProduct(
  productId: number,
  payload: AdminProductUpdatePayload,
) {
  const response = await apiClient.put<AdminProduct>(
    `/products/${productId}`,
    payload,
  );

  return response.data;
}

export async function updateAdminProductStock(
  productId: number,
  payload: AdminProductStockPayload,
) {
  const response = await apiClient.put<AdminProduct>(
    `/admin/products/${productId}/stock`,
    payload,
  );

  return response.data;
}

export async function setAdminProductActive(
  productId: number,
  payload: AdminProductActivePayload,
) {
  const response = await apiClient.put<AdminProduct>(
    `/admin/products/${productId}/active`,
    payload,
  );

  return response.data;
}

export async function deleteAdminProduct(productId: number) {
  await apiClient.delete(`/admin/products/${productId}`);
}

export async function uploadAdminProductImages(
  productId: number,
  files: FileList | File[],
  mainIndex?: number,
) {
  const formData = new FormData();
  const selectedFiles = Array.from(files).slice(0, 5);

  selectedFiles.forEach((file) => formData.append("files", file));

  const response = await apiClient.post<AdminProduct>(
    `/products/${productId}/images`,
    formData,
    {
      params: {
        main_index:
          mainIndex !== undefined && mainIndex < selectedFiles.length
            ? mainIndex
            : undefined,
      },
    },
  );

  return response.data;
}
