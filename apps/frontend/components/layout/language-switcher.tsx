"use client";

import { Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { localeLabels, routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("LanguageSwitcher");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    window.localStorage.setItem("preferred_locale", nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    startTransition(() => {
      router.replace(href, { locale: nextLocale });
    });
  }

  return (
    <label className="relative inline-flex items-center gap-2">
      <span className="sr-only">{t("label")}</span>
      <Globe2 aria-hidden="true" className="size-4 text-red-300" />
      <select
        aria-label={t("label")}
        className="h-10 rounded-md border border-white/10 bg-white/[0.06] px-2 pr-8 text-xs font-black uppercase tracking-wide text-white outline-none transition hover:bg-white/10 focus:border-red-300 disabled:opacity-60 sm:text-sm"
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as Locale)}
        value={locale}
      >
        {routing.locales.map((item) => (
          <option className="bg-zinc-950 text-white" key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
