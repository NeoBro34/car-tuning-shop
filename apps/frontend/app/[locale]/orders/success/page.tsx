import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type OrderSuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export async function generateMetadata({
  params,
}: OrderSuccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OrderSuccess" });

  return {
    title: t("eyebrow"),
    description: t("withoutId"),
  };
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: OrderSuccessPageProps) {
  const { locale } = await params;
  const { orderId } = await searchParams;
  const common = await getTranslations({ locale, namespace: "Common" });
  const t = await getTranslations({ locale, namespace: "OrderSuccess" });

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
      <div className="auto-card w-full rounded-lg p-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          {t("headline")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {orderId ? t("withId", { orderId }) : t("withoutId")}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link className="btn-primary" href="/products">
            {common("continueShopping")}
          </Link>
          <Link className="btn-secondary" href="/cart">
            {common("viewCart")}
          </Link>
        </div>
      </div>
    </section>
  );
}
