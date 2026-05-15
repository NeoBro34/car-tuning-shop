"use client";

import { Boxes, DollarSign, ShoppingBag, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { getAdminDashboard } from "@/features/admin/admin.service";
import type { AdminDashboard } from "@/features/admin/admin.types";
import { formatCartPrice } from "@/features/cart/cart-format";

export function AdminDashboardPage() {
  const t = useTranslations("Admin");
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        setDashboard(await getAdminDashboard());
      } catch {
        setError(t("metricsError"));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [t]);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-white/10" />;
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-lg border border-red-400/30 bg-red-950/40 p-6 text-red-200">
        {error ?? t("unavailable")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard icon={Users} label={t("totalUsers")} value={dashboard.total_users} />
        <DashboardCard
          icon={Boxes}
          label={t("totalProducts")}
          value={dashboard.total_products}
        />
        <DashboardCard
          icon={ShoppingBag}
          label={t("totalOrders")}
          value={dashboard.total_orders}
        />
        <DashboardCard
          icon={DollarSign}
          label={t("totalRevenue")}
          value={formatCartPrice(dashboard.total_revenue)}
        />
      </div>
      <div className="auto-card rounded-lg p-5">
        <h2 className="text-lg font-black text-white">{t("overview")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["catalogHealth", "orderQueue", "userPermissions"].map((item) => (
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-4" key={item}>
              <p className="text-sm font-black text-zinc-200">{t(item)}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {t("overviewText")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
