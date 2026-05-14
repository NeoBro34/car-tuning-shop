import type { Metadata } from "next";
import { ProductDetailPage } from "@/features/products/components/product-detail-page";

type ProductDetailRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata: Metadata = {
  title: "Product Detail",
  description: "View product details, images, pricing, and stock status.",
};

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug} />;
}
