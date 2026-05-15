"use client";

import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";

export function AuthNav() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, logout, user } = useAuthStore();

  function handleLogout() {
    logout();
    toast.success("Logged out");
    router.push("/login");
  }

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Link
        className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
        href="/register"
      >
        Register
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-40 truncate text-sm font-semibold text-zinc-600 sm:inline">
        {user?.full_name || user?.email}
      </span>
      <button
        className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
        onClick={handleLogout}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}
