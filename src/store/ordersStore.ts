import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { CartItem } from "@/lib/data";

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: "Pending" | "Accepted" | "Shipped" | "Delivered";
  shipping_name: string;
  shipping_street: string;
  shipping_city: string;
  shipping_zip: string;
  shipping_phone: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  customization?: any;
  created_at: string;
}

interface OrdersStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchUserOrders: (userId: string) => Promise<void>;
  createOrder: (
    userId: string,
    items: CartItem[],
    total: number,
    address: {
      name: string;
      street: string;
      city: string;
      zip: string;
      phone: string;
    }
  ) => Promise<string>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  clearError: () => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchUserOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ orders: data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createOrder: async (userId, items, total, address) => {
    set({ isLoading: true, error: null });
    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          total,
          status: "Pending",
          shipping_name: address.name,
          shipping_street: address.street,
          shipping_city: address.city,
          shipping_zip: address.zip,
          shipping_phone: address.phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        customization: item.customization || null,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      set((state) => ({
        orders: [orderData, ...state.orders],
        isLoading: false,
      }));

      return orderData.id;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status: status as any } : order
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
