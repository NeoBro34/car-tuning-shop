"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

type AdminGuardProps = {
  children: React.ReactNode;
};

const adminRoles = new Set(["ADMIN", "SUPER_ADMIN"]);

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const isAdmin = user ? adminRoles.has(user.role) : false;

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
        <div className="h-96 animate-pulse rounded-lg bg-zinc-100" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          Admin access is required.
        </div>
      </div>
    );
  }

  return children;
}
