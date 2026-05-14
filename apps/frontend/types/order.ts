export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderCreatePayload = {
  customer_name: string;
  phone_number: string;
  address: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string | number;
  subtotal: string | number;
};

export type Order = {
  id: number;
  user_id: number;
  status: OrderStatus;
  total_price: string | number;
  customer_name: string;
  phone_number: string;
  address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};
