import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import api from '@/lib/axios';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addItem: (product: Product, variant: { size: string; color: string }, quantity?: number) => Promise<void>;
  updateItem: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  removeItem: (productId: string, size: string, color: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoading: false,

      addItem: async (product: Product, variant: { size: string; color: string }, quantity = 1) => {
        try {
          set({ isLoading: true });
          
          await api.post('/cart/add', {
            productId: product._id,
            size: variant.size,
            color: variant.color,
            quantity,
          });

          await get().fetchCart();
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (productId: string, size: string, color: string, quantity: number) => {
        try {
          set({ isLoading: true });

          await api.put('/cart/update', {
            productId,
            size,
            color,
            quantity,
          });

          await get().fetchCart();
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (productId: string, size: string, color: string) => {
        try {
          set({ isLoading: true });

          await api.delete('/cart/remove', {
            data: {
              productId,
              size,
              color,
            },
          });

          await get().fetchCart();
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true });

          await api.delete('/cart/clear');

          set({
            items: [],
            totalItems: 0,
            totalPrice: 0,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          
          const response = await api.get('/cart');
          const cart = response.data.data;

          set({
            items: cart.items || [],
            totalItems: cart.totalItems || 0,
            totalPrice: cart.totalPrice || 0,
            isLoading: false,
          });
        } catch {
          set({
            items: [],
            totalItems: 0,
            totalPrice: 0,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);