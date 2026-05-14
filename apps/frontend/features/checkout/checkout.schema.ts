import { z } from "zod";

export const checkoutSchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  customer_name: z.string().min(2, "Name must be at least 2 characters"),
  phone_number: z.string().min(5, "Phone number must be at least 5 characters"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
