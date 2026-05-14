import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review selected tuning parts before checkout.",
};

export default function CartPage() {
  return (
    <PageHeader
      eyebrow="Shopping cart"
      title="Cart"
      description="Cart items, quantity controls, totals, and checkout navigation will be implemented here."
    />
  );
}
