import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    user: null | {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }
    login: (user: AuthState['user']) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        { name: 'auth-store' }
    )
)
