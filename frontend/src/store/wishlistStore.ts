import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItem, Product } from '@/types';
import api from '@/lib/axios';

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  isLoading: boolean;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      isLoading: false,

      addItem: async (productId: string) => {
        try {
          set({ isLoading: true });
          
          await api.post('/wishlist/add', {
            productId,
          });

          await get().fetchWishlist();
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (productId: string) => {
        try {
          set({ isLoading: true });

          await api.delete('/wishlist/remove', {
            data: {
              productId,
            },
          });

          await get().fetchWishlist();
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchWishlist: async () => {
        try {
          set({ isLoading: true });
          
          const response = await api.get('/wishlist');
          const wishlist = response.data.data;

          set({
            items: wishlist.items || [],
            totalItems: wishlist.items.length || 0,
            isLoading: false,
          });
        } catch {
          set({
            items: [],
            totalItems: 0,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'wishlist-store',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
      }),
    }
  )
);