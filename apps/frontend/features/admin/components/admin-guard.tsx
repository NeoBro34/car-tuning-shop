"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

type AdminGuardProps = {
  children: React.ReactNode;
};

const adminRoles = new Set(["ADMIN", "SUPER_ADMIN"]);

function normalizeRole(role?: string) {
  return role?.toUpperCase();
}

export function AdminGuard({ children }: AdminGuardProps) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const isAdmin = user ? adminRoles.has(normalizeRole(user.role) ?? "") : false;

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user && !isAdmin) {
      router.replace("/products");
    }
  }, [isAdmin, isAuthenticated, isHydrated, router, user]);

  if (!isHydrated || !isAuthenticated || !user) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-400/30 bg-red-950/40 p-6 text-red-200">
          {t("accessRequired")}
        </div>
      </div>
    );
  }

  return children;
}
