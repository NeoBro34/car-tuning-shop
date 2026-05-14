import type { ListMeta, Product } from "@/features/products";
import type { Order, OrderStatus } from "@/types/order";
import type { User } from "@/features/auth";

export type AdminDashboard = {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: string | number;
};

export type AdminListResponse<T> = {
  items: T[];
  meta: ListMeta;
};

export type AdminProductPayload = {
  name: string;
  slug?: string | null;
  description: string;
  price: string;
  discount_price?: string | null;
  stock_quantity: number;
  sku: string;
  category_id: number;
  brand_id: number;
};

export type AdminProductUpdatePayload = Partial<AdminProductPayload>;

export type AdminProductStockPayload = {
  stock_quantity: number;
};

export type AdminProductActivePayload = {
  is_active: boolean;
};

export type AdminOrderStatusPayload = {
  status: OrderStatus;
};

export type AdminUser = User;
export type AdminOrder = Order;
export type AdminProduct = Product;
