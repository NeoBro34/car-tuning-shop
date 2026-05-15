"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Gauge, Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCartCount } from "@/hooks/use-cart-count";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
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
    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          aria-label="Car Tuning Shop home"
          className="group flex items-center gap-3"
          href="/"
          onClick={closeMenu}
        >
          <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-950/30 transition group-hover:scale-105">
            <Gauge aria-hidden="true" className="size-5" />
          </span>
          <span className="leading-none">
            <span className="block text-sm font-black uppercase tracking-wide text-white sm:text-base">
              Car Tuning
            </span>
            <span className="block text-xs font-semibold text-zinc-500">
              Performance parts
            </span>
          </span>
        </Link>

        <div className="hidden items-center rounded-md border border-white/10 bg-white/[0.04] p-1 shadow-sm shadow-black/30 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                className={cn(
                  "relative rounded px-4 py-2 text-sm font-semibold text-zinc-400 transition",
                  "hover:bg-white/10 hover:text-white",
                  active && "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
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
              Admin
            </Link>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isHydrated && isAuthenticated ? (
            <>
              <span className="hidden max-w-40 items-center gap-2 truncate rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-zinc-200 lg:flex">
                <User aria-hidden="true" className="size-4 text-red-300" />
                <span className="truncate">{user?.full_name || user?.email}</span>
              </span>
              <button
                className="rounded-md px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="rounded-md px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-red-950/30 transition hover:brightness-110"
                href="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
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

      {isOpen ? (
        <div className="border-t border-white/10 bg-zinc-950 px-4 py-4 shadow-lg shadow-black/30 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  className={cn(
                    "flex min-h-11 items-center justify-between rounded-md px-3 text-sm font-bold text-zinc-300",
                    active ? "bg-white text-zinc-950" : "hover:bg-white/10",
                  )}
                  href={item.href}
                  key={item.href}
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
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
                  "flex min-h-11 items-center rounded-md px-3 text-sm font-bold text-zinc-300",
                  isActivePath(pathname, "/admin")
                    ? "bg-white text-zinc-950"
                    : "hover:bg-white/10",
                )}
                href="/admin"
                onClick={closeMenu}
              >
                Admin
              </Link>
            ) : null}

            <div className="mt-2 grid gap-2 border-t border-white/10 pt-4">
              {isHydrated && isAuthenticated ? (
                <>
                  <div className="flex min-h-11 items-center gap-2 rounded-md bg-white/[0.06] px-3 text-sm font-semibold text-zinc-200">
                    <User aria-hidden="true" className="size-4 text-red-300" />
                    <span className="truncate">{user?.full_name || user?.email}</span>
                  </div>
                  <button
                    className="min-h-11 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-3 text-left text-sm font-bold text-white transition hover:brightness-110"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    className="flex min-h-11 items-center justify-center rounded-md border border-white/10 text-sm font-bold text-zinc-200"
                    href="/login"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    className="flex min-h-11 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-orange-500 text-sm font-bold text-white"
                    href="/register"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <Link
        aria-label="Open cart"
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
