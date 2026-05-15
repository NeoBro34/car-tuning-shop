import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductDetailPage } from "@/features/products/components/product-detail-page";
import { getProductBySlug } from "@/features/products/product.service";
import { buildPageMetadata, buildProductMetadata } from "@/lib/seo";

type ProductDetailRouteProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "ProductDetail" });

  try {
    const product = await getProductBySlug(slug);

    return buildProductMetadata(locale, product);
  } catch {
    return buildPageMetadata({
      locale,
      path: `/products/${slug}`,
      title: t("related"),
      description: t("compatibilityText"),
      keywords: ["product detail", "car tuning product"],
    });
  }
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug} />;
}
