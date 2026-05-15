import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
    name: "NEXT_LOCALE",
    sameSite: "lax",
  },
  localeDetection: true,
  localePrefix: "always",
  locales: ["en", "uz", "ru", "kr"],
});

export type Locale = (typeof routing.locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  kr: "한국어",
  ru: "Русский",
  uz: "O'zbek",
};
