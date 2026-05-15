import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartPage as CartFeaturePage } from "@/features/cart/components/cart-page";

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CartPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cart" });

  return {
    title: t("headline"),
    description: t("emptyDescription"),
  };
}

export default function CartPage() {
  return <CartFeaturePage />;
}
