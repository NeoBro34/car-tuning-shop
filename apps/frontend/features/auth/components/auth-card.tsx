import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AuthCard({ children, description, title }: AuthCardProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <div className="hidden lg:block">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
          Member access
        </p>
        <h2 className="mt-4 max-w-xl text-5xl font-black uppercase leading-none text-white">
          Keep your build cart ready.
        </h2>
        <div className="mt-8 grid max-w-xl gap-3">
          {["Saved cart flow", "Protected checkout", "Admin-ready access control"].map(
            (item) => (
              <div className="auto-card rounded-md p-4 text-sm font-bold text-zinc-300" key={item}>
                {item}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="auto-card w-full rounded-lg p-6">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
            Account
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
