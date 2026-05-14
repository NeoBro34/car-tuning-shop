import { useCartStore } from "@/store/cart-store";

export function useCartCount() {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
}
