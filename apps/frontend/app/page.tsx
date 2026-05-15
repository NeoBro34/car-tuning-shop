import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

const categories = [
  { name: "Turbo kits", meta: "Boost ready", icon: Zap },
  { name: "Coilovers", meta: "Track stance", icon: Wrench },
  { name: "Exhausts", meta: "Deeper tone", icon: Gauge },
  { name: "ECU tuning", meta: "Mapped power", icon: Sparkles },
];

const popularProducts = [
  { name: "Stage 2 Intake Kit", price: "$349", tag: "Popular" },
  { name: "Titanium Cat-back Exhaust", price: "$1,180", tag: "Sale" },
  { name: "Street Coilover Set", price: "$899", tag: "In stock" },
];

const brands = ["ApexFlow", "Redline", "ForgeLab", "TrackSpec", "BoostWorks"];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-200">
            <Gauge className="size-4" />
            Performance parts marketplace
          </div>
          <div>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-none tracking-normal text-white sm:text-6xl lg:text-7xl">
              Tune harder. Shop smarter.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Premium tuning parts, accessories, and fitment-ready upgrades for
              street builds, weekend track cars, and shop projects.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary gap-2" href="/products">
              Browse products
              <ArrowRight className="size-4" />
            </Link>
            <Link className="btn-secondary" href="/register">
              Create account
            </Link>
          </div>
          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["1K+", "parts"],
              ["24h", "dispatch"],
              ["100%", "fitment focus"],
            ].map(([value, label]) => (
              <div className="auto-card rounded-md p-4" key={label}>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-8 rounded-full bg-red-500/20 blur-3xl" />
          <div className="auto-card relative overflow-hidden rounded-lg p-5">
            <div className="aspect-[4/3] rounded-md border border-white/10 bg-[linear-gradient(135deg,#18181b_0%,#09090b_42%,#7f1d1d_100%)] p-5">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-white px-3 py-1 text-xs font-black uppercase text-zinc-950">
                    Featured build
                  </span>
                  <span className="text-sm font-black text-orange-300">STAGE 2</span>
                </div>
                <div>
                  <div className="h-24 rounded-[50%] border-t-4 border-red-400/70 bg-gradient-to-b from-zinc-700/60 to-zinc-950 shadow-2xl shadow-black" />
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {popularProducts.map((product) => (
                      <div
                        className="rounded-md border border-white/10 bg-black/35 p-3"
                        key={product.name}
                      >
                        <p className="text-xs font-bold text-zinc-400">
                          {product.tag}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-black text-white">
                          {product.name}
                        </p>
                        <p className="mt-2 text-sm font-black text-orange-300">
                          {product.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                className="auto-card group rounded-lg p-5 transition hover:-translate-y-1 hover:border-red-400/50"
                href="/products"
                key={category.name}
              >
                <Icon className="size-7 text-red-300" />
                <h2 className="mt-5 text-xl font-black text-white">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm font-semibold text-zinc-500">
                  {category.meta}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/25">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
              Popular products
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Fast-moving upgrades for serious builds
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {popularProducts.map((product) => (
              <Link
                className="rounded-lg border border-white/10 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-orange-300/50"
                href="/products"
                key={product.name}
              >
                <span className="rounded bg-red-500/15 px-2 py-1 text-xs font-black uppercase text-red-200">
                  {product.tag}
                </span>
                <h3 className="mt-5 min-h-14 text-lg font-black text-white">
                  {product.name}
                </h3>
                <p className="mt-4 text-2xl font-black text-orange-300">
                  {product.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="auto-card rounded-lg p-6">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
              Brands
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {brands.map((brand) => (
                <div
                  className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-5 text-center text-sm font-black uppercase tracking-wide text-zinc-200"
                  key={brand}
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Verified fitment" },
              { icon: Truck, title: "Fast dispatch" },
              { icon: PackageCheck, title: "Order tracking" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div className="auto-card rounded-lg p-5" key={item.title}>
                  <Icon className="size-7 text-orange-300" />
                  <h3 className="mt-5 text-lg font-black text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Clean catalog data and checkout flow built for car parts.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-400/30 bg-gradient-to-r from-red-600 to-orange-500 p-6 text-zinc-950 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <BadgeCheck className="size-8" />
              <h2 className="mt-4 text-3xl font-black uppercase">
                Build list ready?
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-bold text-zinc-900">
                Find parts, compare stock, add to cart, and place your order in
                one clean marketplace flow.
              </p>
            </div>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-black text-white transition hover:bg-black"
              href="/products"
            >
              Open catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
