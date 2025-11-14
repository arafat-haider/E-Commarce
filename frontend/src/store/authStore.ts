import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { User } from '@/types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data.data;
          
          // Set token in localStorage and axios headers
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Login failed');
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true });
          await api.post('/auth/register', data);
          set({ isLoading: false });
        } catch {
          set({ isLoading: false });
          throw new Error('Registration failed');
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const response = await api.put('/auth/profile', data);
          const { user } = response.data.data;
          
          set({
            user,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Profile update failed');
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          const { user } = response.data.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch {
          // Silent fail - token is invalid
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);