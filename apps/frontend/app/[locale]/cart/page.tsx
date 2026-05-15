import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartPage as CartFeaturePage } from "@/features/cart/components/cart-page";
import { buildPageMetadata } from "@/lib/seo";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cart" });

  return buildPageMetadata({
    locale,
    path: "/cart",
    title: t("headline"),
    description: t("emptyDescription"),
    keywords: ["shopping cart", "car parts cart", "checkout tuning parts"],
    noIndex: true,
  });
}

export default function CartPage() {
  return <CartFeaturePage />;
}
