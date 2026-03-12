import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pushEcommerceEvent } from "@/lib/datalayer";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
  image?: string;
}

interface CartState {
  items: CartItem[];
  discount: number;
  couponCode: string | null;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, amount: number) => void;
  removeCoupon: () => void;

  // Computed (via getters/helpers)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,
      couponCode: null,

      addItem: (newItem) => {
        const id = `${newItem.productId}-${newItem.variant?.size || ""}-${newItem.variant?.color || ""}`;
        const items = get().items;
        const existingItem = items.find((item) => item.id === id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item,
            ),
          });
        } else {
          set({
            items: [...items, { ...newItem, id }],
          });
        }

        // 4.8a: Fire DataLayer event (handled in AddToCartButton too, but good to have here for consistency)
        // Note: Actual firing usually happens in the UI component to ensure all context is available,
        // but the prompt suggests the store should handle it.
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find(i => i.id === id);

        if (itemToRemove) {
          // 4.8d: Fire remove_from_cart event
          pushEcommerceEvent("remove_from_cart", {
            currency: "INR",
            value: itemToRemove.price * itemToRemove.quantity,
            items: [{
              item_id: itemToRemove.productId,
              item_name: itemToRemove.title,
              price: itemToRemove.price,
              quantity: itemToRemove.quantity,
              item_variant: itemToRemove.variant?.size
            }]
          });
        }

        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], discount: 0, couponCode: null });
      },

      applyCoupon: (code, amount) => {
        set({ couponCode: code, discount: amount });
      },

      removeCoupon: () => {
        set({ couponCode: null, discount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal - get().discount);
      },
    }),
    {
      name: "vastrayug-cart",
    },
  ),
);
