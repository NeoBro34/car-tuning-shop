"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductImage } from "@/features/products/product.types";
import { mediaUrl } from "@/lib/media-url";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const productDetail = useTranslations("ProductDetail");
  const products = useTranslations("Products");
  const shouldReduceMotion = useReducedMotion();
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
  const activeImageUrl = mediaUrl(activeImage?.image_url);

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/30">
        <AnimatePresence initial={false} mode="wait">
          {activeImageUrl ? (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0"
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.01 }}
              key={activeImage.id}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Image
                alt={productName}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                src={activeImageUrl}
              />
            </motion.div>
          ) : (
            <motion.span
              animate={{ opacity: 1 }}
              className="px-4 text-center text-sm font-semibold text-zinc-500"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="empty"
            >
              {products("productImage")}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {sortedImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {sortedImages.map((image, index) => {
            const isActive = image.id === activeImage?.id;
            const thumbnailUrl = mediaUrl(image.image_url);

            return (
              <motion.button
                aria-label={productDetail("thumbnail", { index: index + 1 })}
                className={`aspect-square overflow-hidden rounded-md border bg-zinc-900 transition ${
                  isActive
                    ? "border-red-400 ring-2 ring-red-500/20"
                    : "border-white/10 hover:border-white/30"
                }`}
                key={image.id}
                onClick={() => setActiveImageId(image.id)}
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                {thumbnailUrl ? (
                  <Image
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                    height={160}
                    loading="lazy"
                    src={thumbnailUrl}
                    width={160}
                  />
                ) : null}
              </motion.button>
            );
          })}
        </div>
      ) : null}
    </motion.section>
  );
}
