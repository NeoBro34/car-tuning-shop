import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductDetailPage } from "@/features/products/components/product-detail-page";

type ProductDetailRouteProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProductDetail" });

  return {
    title: t("related"),
    description: t("compatibilityText"),
  };
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug} />;
}
