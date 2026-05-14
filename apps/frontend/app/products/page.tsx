import type { Metadata } from "next";
import { ProductsPage } from "@/features/products/components/products-page";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse car tuning parts and accessories.",
};

export default function ProductsRoute() {
  return <ProductsPage />;
}
