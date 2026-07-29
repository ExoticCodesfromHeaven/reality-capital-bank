import { create } from "zustand";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  avatar?: string | null;

  role: {
    id: string;
    name: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),

  setUser: (user) => set({ user }),

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }

    set({ accessToken: token });
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      user: null,
      accessToken: null,
    });
  },
}));
