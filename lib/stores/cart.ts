import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  itemId: string;
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  image?: { publicId: string; alt: string };
  config?: Record<string, unknown>;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  isOpen: boolean;
  isSyncing: boolean;

  addItem: (item: Omit<CartItem, "itemId">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateConfig: (itemId: string, config: Record<string, unknown>) => void;
  clearCart: () => void;
  setCart: (cartId: string, items: CartItem[]) => void;
  mergeCart: (serverItems: CartItem[]) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setSyncing: (syncing: boolean) => void;

  subtotalCents: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      isOpen: false,
      isSyncing: false,

      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i?.productId === item?.productId &&
              i.variantId === item.variantId &&
              JSON.stringify(i.config) === JSON.stringify(item.config)
          );
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
            return { items: newItems };
          }
          return { items: [...state.items, { ...item, itemId: `item_${Date.now()}` }] };
        }),

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.itemId === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      updateConfig: (itemId, config) =>
        set((state) => ({
          items: state.items.map((i) => (i.itemId === itemId ? { ...i, config } : i)),
        })),

      clearCart: () => set({ items: [], cartId: null }),

      setCart: (cartId, items) => set({ cartId, items }),

      mergeCart: (serverItems) =>
        set((state) => {
          const merged = [...serverItems];
          for (const localItem of state.items) {
            const exists = merged.some(
              (s) =>
                s?.productId === localItem?.productId &&
                s.variantId === localItem.variantId &&
                JSON.stringify(s.config) === JSON.stringify(localItem.config)
            );
            if (!exists) merged.push(localItem);
          }
          return { items: merged };
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setSyncing: (isSyncing) => set({ isSyncing }),

      subtotalCents: () => get().items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cookie-crumbs-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function CartProvider({ children }: { children: React.ReactNode }) {
  return children;
}
