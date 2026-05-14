import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Create an order from your cart.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
