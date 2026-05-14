export type CartProduct = {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  discount_price: string | number | null;
  stock_quantity: number;
  sku: string;
};

export type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product: CartProduct;
  line_subtotal: string | number;
};

export type CartResponse = {
  items: CartItem[];
  subtotal: string | number;
  total_items: number;
};

export type AddCartItemPayload = {
  product_id: number;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};
