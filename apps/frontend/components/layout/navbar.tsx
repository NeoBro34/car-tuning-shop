"use client";

import { Link } from "@/i18n/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Gauge, Menu, ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { useCartCount } from "@/hooks/use-cart-count";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { href: "/", labelKey: "home" },
  { href: "/products", labelKey: "products" },
  { href: "/cart", labelKey: "cart" },
];

function normalizeRole(role?: string) {
  return role?.toUpperCase();
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const common = useTranslations("Common");
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartCount();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isHydrated, logout, user } = useAuthStore();
  const normalizedRole = normalizeRole(user?.role);
  const isAdmin = normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN";

  function closeMenu() {
    setIsOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    toast.success(t("loggedOut"));
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          aria-label="Car Tuning Shop home"
          className="group flex min-w-0 items-center gap-3"
          href="/"
          onClick={closeMenu}
        >
          <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-950/30 transition group-hover:scale-105">
            <Gauge aria-hidden="true" className="size-5" />
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black uppercase tracking-wide text-white sm:text-base">
              {t("brand")}
            </span>
            <span className="block text-xs font-semibold text-zinc-500">
              {t("tagline")}
            </span>
          </span>
        </Link>

        <div className="hidden items-center rounded-md border border-white/10 bg-white/[0.04] p-1 shadow-sm shadow-black/30 lg:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                className={cn(
                  "relative rounded px-4 py-2 text-sm font-bold text-zinc-400 transition",
                  "hover:bg-white/10 hover:text-white",
                  active && "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950",
                )}
                href={item.href}
                key={item.href}
              >
                  {common(item.labelKey)}
                {item.href === "/cart" && cartCount > 0 ? (
                  <span className="ml-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              className={cn(
                "rounded px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-white/10 hover:text-white",
                isActivePath(pathname, "/admin") &&
                  "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950",
              )}
              href="/admin"
            >
              {common("admin")}
            </Link>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            aria-label={t("openCart")}
            className="relative grid size-11 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-zinc-200 transition hover:border-red-300/40 hover:bg-white/10 hover:text-white"
            href="/cart"
          >
            <ShoppingBag aria-hidden="true" className="size-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-black leading-none text-white ring-2 ring-zinc-950">
                {cartCount}
              </span>
            ) : null}
          </Link>
          {isHydrated && isAuthenticated ? (
            user ? <UserDropdown user={user} /> : null
          ) : (
            <>
              <Link
                className="rounded-md px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                href="/login"
              >
                {common("login")}
              </Link>
              <Link
                className="rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-red-950/30 transition hover:brightness-110"
                href="/register"
              >
                {common("register")}
              </Link>
            </>
          )}
          <Suspense fallback={null}>
            <LanguageSwitcher />
          </Suspense>
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={t("toggleMenu")}
          className="grid size-10 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-white shadow-sm md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </nav>

      <div id="mobile-navigation">
        <MobileMenu
          cartCount={cartCount}
          isAdmin={isAdmin}
          isAuthenticated={isAuthenticated}
          isHydrated={isHydrated}
          isOpen={isOpen}
          onClose={closeMenu}
          onLogout={handleLogout}
          pathname={pathname}
          user={user}
        />
      </div>

      <Link
        aria-label={t("openCart")}
        className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl shadow-red-950/30 transition hover:brightness-110 md:hidden"
        href="/cart"
        onClick={closeMenu}
      >
        <ShoppingBag aria-hidden="true" className="size-5" />
        {cartCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[10px] font-black text-zinc-950 ring-2 ring-zinc-950">
            {cartCount}
          </span>
        ) : null}
      </Link>
    </header>
  );
}
