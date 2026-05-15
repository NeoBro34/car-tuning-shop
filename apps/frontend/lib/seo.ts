import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import type { Product } from "@/features/products/product.types";
import { mediaUrl } from "@/lib/media-url";

const fallbackSiteUrl = "http://localhost:3000";

export const seoConfig = {
  siteName: "Car Tuning Shop",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? fallbackSiteUrl,
  defaultImage: "/og-image.jpg",
  twitterHandle: "@cartuningshop",
  localeMap: {
    en: "en_US",
    kr: "ko_KR",
    ru: "ru_RU",
    uz: "uz_UZ",
  } satisfies Record<Locale, string>,
  defaultKeywords: [
    "car tuning parts",
    "performance parts",
    "auto accessories",
    "turbo kits",
    "coilovers",
    "exhaust systems",
    "ECU tuning",
  ],
};

type BuildMetadataInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

function normalizeLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

export function getSiteUrl() {
  return new URL(seoConfig.siteUrl);
}

export function buildLocalizedPath(locale: string, path = "/") {
  const normalizedLocale = normalizeLocale(locale);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `/${normalizedLocale}${cleanPath === "/" ? "" : cleanPath}`;
}

export function absoluteUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl, getSiteUrl()).toString();
  }
}

export function buildLanguageAlternates(path = "/") {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(buildLocalizedPath(locale, path)),
    ]),
  );
}

export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  keywords = [],
  image,
  type = "website",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const normalizedLocale = normalizeLocale(locale);
  const canonicalPath = buildLocalizedPath(normalizedLocale, path);
  const canonical = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl(image ?? seoConfig.defaultImage);
  const mergedKeywords = [...new Set([...keywords, ...seoConfig.defaultKeywords])];

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
      languages: {
        ...buildLanguageAlternates(path),
        "x-default": absoluteUrl(buildLocalizedPath(routing.defaultLocale, path)),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: seoConfig.siteName,
      locale: seoConfig.localeMap[normalizedLocale],
      alternateLocale: routing.locales
        .filter((item) => item !== normalizedLocale)
        .map((item) => seoConfig.localeMap[item]),
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitterHandle,
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function getProductMainImage(product: Product) {
  return mediaUrl(
    product.images.find((image) => image.is_main)?.image_url ??
    product.images[0]?.image_url ??
    null,
  );
}

export function buildProductMetadata(locale: string, product: Product): Metadata {
  const price = product.discount_price ?? product.price;
  const description =
    product.description?.trim() ||
    `Buy ${product.name} performance tuning part from ${seoConfig.siteName}.`;

  return buildPageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: product.name,
    description,
    image: getProductMainImage(product),
    keywords: [
      product.name,
      product.sku,
      `${product.name} tuning part`,
      `performance part ${price}`,
    ],
  });
}
