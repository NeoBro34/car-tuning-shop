import type { MetadataRoute } from "next";
import { getProducts } from "@/features/products/product.service";
import { absoluteUrl, buildLocalizedPath } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const staticPaths = ["/", "/products"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = routing.locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: absoluteUrl(buildLocalizedPath(locale, path)),
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "hourly",
      priority: path === "/" ? 1 : 0.9,
    })),
  ) satisfies MetadataRoute.Sitemap;

  try {
    const products = await getProducts({ limit: 100, offset: 0 });
    const productEntries = products.items.flatMap((product) =>
      routing.locales.map((locale) => ({
        url: absoluteUrl(buildLocalizedPath(locale, `/products/${product.slug}`)),
        lastModified: product.updated_at ? new Date(product.updated_at) : now,
        changeFrequency: "daily",
        priority: 0.8,
      })),
    ) satisfies MetadataRoute.Sitemap;

    return [...staticEntries, ...productEntries];
  } catch {
    return staticEntries;
  }
}
