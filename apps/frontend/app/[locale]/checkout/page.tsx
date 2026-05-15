import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";
import { buildPageMetadata } from "@/lib/seo";

type CheckoutRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });

  return buildPageMetadata({
    locale,
    path: "/checkout",
    title: t("headline"),
    description: t("description"),
    keywords: ["checkout", "order tuning parts", "car parts delivery"],
    noIndex: true,
  });
}

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
