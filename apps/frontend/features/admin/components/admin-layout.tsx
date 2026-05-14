import { AdminGuard } from "@/features/admin/components/admin-guard";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
            Dashboard
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
