import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, qty: i.qty + (item.qty ?? 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: item.qty ?? 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, qty } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),

      itemCount: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "lukfuk-cart" }
  )
);
