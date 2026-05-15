import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductsPage } from "@/features/products/components/products-page";
import { buildPageMetadata } from "@/lib/seo";

type ProductsRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductsRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });

  return buildPageMetadata({
    locale,
    path: "/products",
    title: t("headline"),
    description: t("description"),
    keywords: ["tuning products", "car parts catalog", "performance parts catalog"],
  });
}

export default function ProductsRoute() {
  return <ProductsPage />;
}
