import type { Metadata } from "next";
import { AdminLayout } from "@/features/admin/components/admin-layout";

export const metadata: Metadata = {
  title: "Admin",
  description: "Car Tuning Shop admin dashboard.",
};

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
