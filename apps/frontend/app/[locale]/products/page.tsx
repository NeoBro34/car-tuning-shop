import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProductsPage } from "@/features/products/components/products-page";

type ProductsRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ProductsRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });

  return {
    title: t("headline"),
    description: t("description"),
  };
}

export default function ProductsRoute() {
  return <ProductsPage />;
}
