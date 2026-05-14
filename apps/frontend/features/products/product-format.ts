export function formatPrice(value: string | number) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getDiscountPercentage(
  price: string | number,
  discountPrice: string | number | null,
) {
  if (!discountPrice) {
    return null;
  }

  const priceValue = Number(price);
  const discountValue = Number(discountPrice);

  if (
    Number.isNaN(priceValue) ||
    Number.isNaN(discountValue) ||
    priceValue <= 0 ||
    discountValue >= priceValue
  ) {
    return null;
  }

  return Math.round(((priceValue - discountValue) / priceValue) * 100);
}
