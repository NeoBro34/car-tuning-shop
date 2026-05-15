import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

type AuthCardProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AuthCard({ children, description, title }: AuthCardProps) {
  const common = useTranslations("Common");
  const t = useTranslations("Auth");
  const benefits = ["benefitCart", "benefitCheckout", "benefitAdmin"] as const;

  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] w-full max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <div className="hidden lg:block">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
          {t("memberAccess")}
        </p>
        <h2 className="mt-4 max-w-xl text-5xl font-black uppercase leading-none text-white">
          {t("splitTitle")}
        </h2>
        <div className="mt-8 grid max-w-xl gap-3">
          {benefits.map((item) => (
              <div className="auto-card rounded-md p-4 text-sm font-bold text-zinc-300" key={item}>
                {t(item)}
              </div>
            ))}
        </div>
      </div>
      <div className="auto-card w-full rounded-lg p-6">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-300">
            {common("account")}
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
