"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ChevronDown,
  LogOut,
  PackageSearch,
  Settings,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import type { User as AuthUser } from "@/features/auth";

type UserDropdownProps = {
  user: AuthUser;
};

const menuItems = [
  { href: "/profile", icon: User, labelKey: "profile" },
  { href: "/orders", icon: PackageSearch, labelKey: "myOrders" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
] as const;

function getInitials(user: AuthUser) {
  const source = user.full_name || user.email;
  const [first = "", second = ""] = source.split(/\s|@/).filter(Boolean);

  return `${first[0] ?? "U"}${second[0] ?? ""}`.toUpperCase();
}

export function UserDropdown({ user }: UserDropdownProps) {
  const common = useTranslations("Common");
  const navbar = useTranslations("Navbar");
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const displayName = user.full_name || user.email;
  const initials = useMemo(() => getInitials(user), [user]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      firstItemRef.current?.focus();
    }
  }, [isOpen]);

  function handleLogout() {
    logout();
    setIsOpen(false);
    toast.success(navbar("loggedOut"));
    router.push("/login");
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          "flex h-11 items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] px-2.5 pr-3 text-left transition",
          "hover:border-red-300/40 hover:bg-white/10 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20",
        )}
        onClick={() => setIsOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        type="button"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 text-xs font-black text-white">
          {initials}
        </span>
        <span className="hidden min-w-0 leading-none lg:block">
          <span className="block max-w-36 truncate text-sm font-black text-white">
            {displayName}
          </span>
          <span className="mt-1 block text-xs font-semibold text-zinc-500">
            {common("account")}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 text-zinc-500 transition-transform",
            isOpen && "rotate-180 text-red-300",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 origin-top-right rounded-lg border border-white/10 bg-zinc-950/98 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: -4 }}
            role="menu"
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
          <div className="border-b border-white/10 p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-gradient-to-br from-red-500 to-orange-500 text-sm font-black text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">
                {displayName}
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-zinc-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="py-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-bold text-zinc-300 outline-none transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
                ref={index === 0 ? firstItemRef : undefined}
                role="menuitem"
              >
                <Icon aria-hidden="true" className="size-4 text-red-300" />
                {common(item.labelKey)}
              </Link>
            );
          })}
        </div>

        <button
          className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-bold text-red-200 outline-none transition hover:bg-red-500/15 hover:text-red-100 focus:bg-red-500/15 focus:text-red-100"
          onClick={handleLogout}
          role="menuitem"
          type="button"
        >
          <LogOut aria-hidden="true" className="size-4" />
          {common("logout")}
        </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
