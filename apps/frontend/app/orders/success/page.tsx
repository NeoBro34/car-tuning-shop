import Link from "next/link";
import type { Metadata } from "next";

type OrderSuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Order Success",
  description: "Your Car Tuning Shop order was created successfully.",
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          Order created
        </p>
        <h1 className="mt-3 text-3xl font-bold text-zinc-950">
          Thanks for your order
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {orderId ? `Order #${orderId} was created successfully.` : "Your order was created successfully."}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link className="btn-primary" href="/products">
            Continue shopping
          </Link>
          <Link className="btn-secondary" href="/cart">
            View cart
          </Link>
        </div>
      </div>
    </section>
  );
}
