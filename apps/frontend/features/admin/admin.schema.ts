import { z } from "zod";

const priceString = z
  .string()
  .min(1, "Price is required")
  .refine((value) => Number(value) > 0, "Price must be greater than 0");

const imageFiles = z.custom<File[]>().refine(
  (files) => !files || files.length <= 5,
  "Upload up to 5 images",
);

export const adminProductSchema = z
  .object({
    brand_id: z.number().int().positive("Brand is required"),
    car_model_id: z.number().int().positive("Car model is required"),
    category_id: z.number().int().positive("Category is required"),
    discount_price: z.string().optional(),
    full_description: z.string().min(1, "Full description is required"),
    images: imageFiles.optional(),
    is_active: z.boolean(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: priceString,
    short_description: z.string().min(1, "Short description is required"),
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    slug: z.string().optional(),
    specifications: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
    stock_quantity: z.number().int().min(0, "Stock cannot be negative"),
  })
  .refine(
    (values) =>
      !values.discount_price ||
      Number(values.discount_price) < Number(values.price),
    {
      message: "Discount price must be lower than price",
      path: ["discount_price"],
    },
  );

export type AdminProductFormValues = z.infer<typeof adminProductSchema>;
