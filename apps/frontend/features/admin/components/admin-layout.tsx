import { AdminGuard } from "@/features/admin/components/admin-guard";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { getTranslations } from "next-intl/server";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export async function AdminLayout({ children }: AdminLayoutProps) {
  const t = await getTranslations("Admin");

  return (
    <AdminGuard>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-normal text-white">
            {t("dashboard")}
          </h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
          <AdminSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    </AdminGuard>
  );
}
