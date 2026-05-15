"use client";

import { Link } from "@/i18n/navigation";
import { LogOut, PackageSearch, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";
import type { User as AuthUser } from "@/features/auth";

type MobileMenuProps = {
  cartCount: number;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isOpen: boolean;
  pathname: string;
  user: AuthUser | null;
  onClose: () => void;
  onLogout: () => void;
};

const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/products", labelKey: "products" },
  { href: "/cart", labelKey: "cart" },
] as const;

const accountItems = [
  { href: "/profile", icon: User, labelKey: "profile" },
  { href: "/orders", icon: PackageSearch, labelKey: "myOrders" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getInitials(user: AuthUser) {
  const source = user.full_name || user.email;
  const [first = "", second = ""] = source.split(/\s|@/).filter(Boolean);

  return `${first[0] ?? "U"}${second[0] ?? ""}`.toUpperCase();
}

export function MobileMenu({
  cartCount,
  isAdmin,
  isAuthenticated,
  isHydrated,
  isOpen,
  pathname,
  user,
  onClose,
  onLogout,
}: MobileMenuProps) {
  const common = useTranslations("Common");

  return (
    <div
      className={cn(
        "overflow-hidden border-t border-white/10 bg-zinc-950 shadow-lg shadow-black/30 transition-[max-height,opacity] duration-200 md:hidden",
        isOpen ? "max-h-[42rem] opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              className={cn(
                "flex min-h-11 items-center justify-between rounded-md px-3 text-sm font-bold text-zinc-300 transition",
                active ? "bg-white text-zinc-950" : "hover:bg-white/10",
              )}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              <span>{common(item.labelKey)}</span>
              {item.href === "/cart" && cartCount > 0 ? (
                <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-black leading-none text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          );
        })}

        {isAdmin ? (
          <Link
            className={cn(
              "flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-zinc-300 transition",
              isActivePath(pathname, "/admin")
                ? "bg-white text-zinc-950"
                : "hover:bg-white/10",
            )}
            href="/admin"
            onClick={onClose}
          >
            {common("admin")}
          </Link>
        ) : null}

        <div className="mt-2 grid gap-2 border-t border-white/10 pt-4">
          {isHydrated && isAuthenticated && user ? (
            <>
              <div className="flex min-h-12 items-center gap-3 rounded-md bg-white/[0.06] px-3 text-sm font-semibold text-zinc-200">
                <span className="grid size-9 place-items-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 text-xs font-black text-white">
                  {getInitials(user)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-black text-white">
                    {user.full_name || user.email}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">
                    {user.email}
                  </span>
                </span>
              </div>

              <div className="grid gap-1">
                {accountItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      href={item.href}
                      key={item.href}
                      onClick={onClose}
                    >
                      <Icon aria-hidden="true" className="size-4 text-red-300" />
                      {common(item.labelKey)}
                    </Link>
                  );
                })}
              </div>

              <button
                className="flex min-h-11 items-center gap-3 rounded-md bg-red-500/15 px-3 text-left text-sm font-bold text-red-100 transition hover:bg-red-500/25"
                onClick={onLogout}
                type="button"
              >
                <LogOut aria-hidden="true" className="size-4" />
                {common("logout")}
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                className="flex min-h-11 items-center justify-center rounded-md border border-white/10 text-sm font-bold text-zinc-200"
                href="/login"
                onClick={onClose}
              >
                {common("login")}
              </Link>
              <Link
                className="flex min-h-11 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 text-sm font-bold text-white"
                href="/register"
                onClick={onClose}
              >
                {common("register")}
              </Link>
            </div>
          )}

          <div className="pt-1">
            <Suspense fallback={null}>
              <LanguageSwitcher />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
