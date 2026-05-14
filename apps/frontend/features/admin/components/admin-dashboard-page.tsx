"use client";

import { Boxes, DollarSign, ShoppingBag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardCard } from "@/features/admin/components/dashboard-card";
import { getAdminDashboard } from "@/features/admin/admin.service";
import type { AdminDashboard } from "@/features/admin/admin.types";
import { formatCartPrice } from "@/features/cart/cart-format";

export function AdminDashboardPage() {
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
        setError("Dashboard metrics could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-zinc-100" />;
  }

  if (error || !dashboard) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        {error ?? "Dashboard unavailable."}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard icon={Users} label="Total users" value={dashboard.total_users} />
      <DashboardCard
        icon={Boxes}
        label="Total products"
        value={dashboard.total_products}
      />
      <DashboardCard
        icon={ShoppingBag}
        label="Total orders"
        value={dashboard.total_orders}
      />
      <DashboardCard
        icon={DollarSign}
        label="Total revenue"
        value={formatCartPrice(dashboard.total_revenue)}
      />
    </div>
  );
}
