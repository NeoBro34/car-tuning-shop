import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AuthCard({ children, description, title }: AuthCardProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            Account
          </p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
