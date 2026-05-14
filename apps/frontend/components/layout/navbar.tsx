import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/login", label: "Login" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link
          className="text-lg font-black tracking-tight text-zinc-950"
          href="/"
        >
          Car Tuning Shop
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
