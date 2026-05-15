import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutPage } from "@/features/checkout/components/checkout-page";

type CheckoutRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });

  return {
    title: t("headline"),
    description: t("description"),
  };
}

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
