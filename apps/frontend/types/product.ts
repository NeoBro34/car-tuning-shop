export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  sku: string;
  status: "active" | "inactive" | "draft";
};
