import { z } from "zod";

export const adminProductSchema = z.object({
  brand_id: z.number().int().positive("Brand is required"),
  category_id: z.number().int().positive("Category is required"),
  description: z.string().min(1, "Description is required"),
  discount_price: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  slug: z.string().optional(),
  stock_quantity: z.number().int().min(0, "Stock cannot be negative"),
});

export type AdminProductFormValues = z.infer<typeof adminProductSchema>;
