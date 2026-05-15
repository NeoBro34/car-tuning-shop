import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminLayout } from "@/features/admin/components/admin-layout";

type AdminRouteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AdminRouteLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Admin" });

  return {
    title: t("dashboard"),
    description: t("overviewText"),
  };
}

export default function AdminRouteLayout({
  children,
}: AdminRouteLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
