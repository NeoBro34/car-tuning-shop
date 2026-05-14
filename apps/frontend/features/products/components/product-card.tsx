"use client";

import toast from "react-hot-toast";
import type {
  Brand,
  Category,
  Product,
} from "@/features/products/product.types";

type ProductCardProps = {
  product: Product;
  category?: Category;
  brand?: Brand;
};

function formatPrice(value: string | number) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function ProductCard({ product, category, brand }: ProductCardProps) {
  const mainImage =
    product.images.find((image) => image.is_main) ?? product.images[0];
  const activePrice = product.discount_price ?? product.price;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={product.name}
            className="h-full w-full object-cover"
            src={mainImage.image_url}
          />
        ) : (
          <span className="px-4 text-center text-sm font-semibold text-zinc-500">
            Product image
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-600">
          <span className="rounded-md bg-zinc-100 px-2 py-1">
            {category?.name ?? `Category #${product.category_id}`}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-1">
            {brand?.name ?? `Brand #${product.brand_id}`}
          </span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-lg font-bold text-zinc-950">
          {product.name}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-zinc-950">
              {formatPrice(activePrice)}
            </p>
            {product.discount_price ? (
              <p className="text-sm text-zinc-500 line-through">
                {formatPrice(product.price)}
              </p>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-zinc-600">
            Stock: {product.stock_quantity}
          </p>
        </div>
        <button
          className="btn-primary mt-5 w-full"
          onClick={() => toast.success("Add to cart placeholder")}
          type="button"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
