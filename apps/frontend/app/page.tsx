import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            Performance parts marketplace
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
            Car Tuning Shop
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            Phase 7.1 frontend shell for browsing tuning parts, managing a cart,
            and connecting to the FastAPI backend.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/products">
              Browse products
            </Link>
            <Link className="btn-secondary" href="/login">
              Login
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {["Turbo kits", "Coilovers", "Exhausts", "ECU tuning"].map(
              (item) => (
                <div
                  className="rounded-md border border-zinc-200 bg-white p-4 shadow-sm"
                  key={item}
                >
                  <p className="font-semibold text-zinc-950">{item}</p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Placeholder category block
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
