"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductImage } from "@/features/products/product.types";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const productDetail = useTranslations("ProductDetail");
  const products = useTranslations("Products");
  const sortedImages = [...images].sort((left, right) => {
    if (left.is_main === right.is_main) {
      return left.id - right.id;
    }

    return left.is_main ? -1 : 1;
  });
  const [activeImageId, setActiveImageId] = useState(
    sortedImages[0]?.id ?? null,
  );
  const activeImage =
    sortedImages.find((image) => image.id === activeImageId) ?? sortedImages[0];

  return (
    <section className="space-y-3">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={productName}
            className="h-full w-full object-cover"
            src={activeImage.image_url}
          />
        ) : (
          <span className="px-4 text-center text-sm font-semibold text-zinc-500">
            {products("productImage")}
          </span>
        )}
      </div>

      {sortedImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {sortedImages.map((image, index) => {
            const isActive = image.id === activeImage?.id;

            return (
              <button
                aria-label={productDetail("thumbnail", { index: index + 1 })}
                className={`aspect-square overflow-hidden rounded-md border bg-zinc-900 transition ${
                  isActive
                    ? "border-red-400 ring-2 ring-red-500/20"
                    : "border-white/10 hover:border-white/30"
                }`}
                key={image.id}
                onClick={() => setActiveImageId(image.id)}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                  src={image.image_url}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
