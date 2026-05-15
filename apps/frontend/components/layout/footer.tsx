import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = [
  {
    title: "What",
    links: [
      { href: "/products", label: "Performance parts" },
      { href: "/products", label: "Accessories" },
      { href: "/products", label: "Car model fitment" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Shop",
    links: [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/checkout", label: "Checkout" },
      { href: "/login", label: "Account" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "mailto:sales@cartuning.shop", label: "Email" },
      { href: "tel:+15550120448", label: "Phone" },
      { href: "/admin", label: "Admin" },
      { href: "/register", label: "Register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#09090b_0%,#18181b_42%,#7f1d1d_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-200">
              Car Tuning Shop
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ready to tune it up?
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-base leading-7 text-zinc-200">
              Browse performance parts, styling upgrades, and accessories built
              for faster ordering and cleaner fitment decisions.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-zinc-950 transition hover:bg-red-100"
                href="/products"
              >
                Browse products
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 text-sm font-black text-white transition hover:bg-white/10"
                href="/register"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            <Link
              className="inline-flex items-center text-2xl font-black tracking-tight text-white"
              href="/"
            >
              Car Tuning Shop
            </Link>
            <div className="grid gap-3 text-sm font-semibold text-zinc-300">
              <p className="flex items-center gap-3">
                <Mail aria-hidden="true" className="size-4 text-red-200" />
                sales@cartuning.shop
              </p>
              <p className="flex items-center gap-3">
                <Phone aria-hidden="true" className="size-4 text-red-200" />
                +1 (555) 012-0448
              </p>
              <p className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="size-4 text-red-200" />
                Performance parts marketplace
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                  {group.title}
                </h3>
                <ul className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.label}`}>
                      <Link
                        className="text-sm font-semibold text-zinc-300 transition hover:text-white"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-sm font-semibold text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Car Tuning Shop. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="transition hover:text-white" href="/products">
              Catalog
            </Link>
            <Link className="transition hover:text-white" href="/cart">
              Cart
            </Link>
            <Link className="transition hover:text-white" href="/checkout">
              Orders
            </Link>
          </div>
        </div>

        <p className="mt-10 select-none text-[clamp(3rem,12vw,10rem)] font-black leading-none tracking-normal text-white/10">
          TUNING
        </p>
      </div>
    </footer>
  );
}
