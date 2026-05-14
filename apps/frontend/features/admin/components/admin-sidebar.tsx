"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, ShoppingBag, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", icon: BarChart3, label: "Dashboard" },
  { href: "/admin/products", icon: Boxes, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
      <nav className="grid gap-1 sm:grid-cols-4 lg:grid-cols-1">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100",
                isActive && "bg-red-50 text-red-700",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
