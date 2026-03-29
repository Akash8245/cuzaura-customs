import { create } from "zustand";
import { CartItem, Product, ShoeCustomization } from "@/lib/data";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, customization?: ShoeCustomization) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Create memoized selectors to avoid unnecessary re-renders
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, customization) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id && !customization);
      if (existing && !customization) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1, customization }] };
    }),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.product.id !== productId)
        : state.items.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] }),
}));

// Memoized selectors to prevent unnecessary renders
export const useCartTotal = () => useCartStore((state) => state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0));
export const useCartItemCount = () => useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));
export const useCartItems = () => useCartStore((state) => state.items);
