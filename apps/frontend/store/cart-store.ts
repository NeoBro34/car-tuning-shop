import { create } from "zustand";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/cart.service";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

type CartState = {
  error: string | null;
  items: CartItem[];
  isLoading: boolean;
  subtotal: number;
  totalItems: number;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
};

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { detail?: string };

    if (data.detail) {
      return data.detail;
    }
  }

  return "Cart request failed.";
}

function applyCartResponse(
  response: Awaited<ReturnType<typeof getCart>>,
): Pick<CartState, "items" | "subtotal" | "totalItems"> {
  return {
    items: response.items,
    subtotal: Number(response.subtotal),
    totalItems: response.total_items,
  };
}

export const useCartStore = create<CartState>((set) => ({
  error: null,
  items: [],
  isLoading: false,
  subtotal: 0,
  totalItems: 0,
  addItem: async (product, quantity = 1) => {
    set({ error: null, isLoading: true });

    try {
      const response = await addCartItem({
        product_id: product.id,
        quantity,
      });

      set({ ...applyCartResponse(response), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
  clearCart: () => set({ error: null, items: [], subtotal: 0, totalItems: 0 }),
  fetchCart: async () => {
    set({ error: null, isLoading: true });

    try {
      const response = await getCart();

      set({ ...applyCartResponse(response), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  removeItem: async (itemId) => {
    set({ error: null, isLoading: true });

    try {
      const response = await removeCartItem(itemId);

      set({ ...applyCartResponse(response), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
  updateQuantity: async (itemId, quantity) => {
    set({ error: null, isLoading: true });

    try {
      const response = await updateCartItem(itemId, { quantity });

      set({ ...applyCartResponse(response), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw error;
    }
  },
}));
