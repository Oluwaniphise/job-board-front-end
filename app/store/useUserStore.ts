import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface UserState {
  user: User | null;
  accessToken: string | null;

  setUser: (userData: User, token: string) => void;
  signOut: () => void;

  // Hydration function to check localStorage
  initialize: () => void;
}

// Constants for localStorage keys
const USER_STORAGE_KEY = "user_data";
const TOKEN_STORAGE_KEY = "accessToken";

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  accessToken: null,

  initialize: () => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser) as User;

        set({ user, accessToken: storedToken });
      }
    } catch (error) {
      // Clear storage if loading failed (e.g., bad JSON format)
      // localStorage.removeItem(USER_STORAGE_KEY);
      // localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },

  setUser: (userData, token) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    set({
      user: userData,
      accessToken: token,
    });
  },

  signOut: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    set({ user: null, accessToken: null });
  },
}));

useUserStore.getState().initialize();
