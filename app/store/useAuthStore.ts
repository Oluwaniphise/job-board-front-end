
import { create } from "zustand";

type AuthState = {
  isLoading: boolean;
  error: string | null;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
