import { create } from "zustand";
import type { SupabaseUser } from "../types";

interface AuthStore {
    user: SupabaseUser | null;
    loading: boolean;
    setUser: (user: SupabaseUser | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading })
}));