import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse car tuning parts and accessories.",
};

export default function ProductsPage() {
  return (
    <PageHeader
      eyebrow="Catalog"
      title="Products"
      description="Product grid, search, and filters by category, brand, car model, and price will be implemented here."
    />
  );
}
