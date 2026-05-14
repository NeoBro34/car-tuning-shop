import type { Metadata } from "next";
import { CartPage as CartFeaturePage } from "@/features/cart/components/cart-page";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review selected tuning parts before checkout.",
};

export default function CartPage() {
  return <CartFeaturePage />;
}
