import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    trackId: number
    licenseId: number
    price: number
    title: string
    artist: string
    cover: string
    licenseName: string
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: CartItem) => void
    removeItem: (trackId: number) => void
    clearCart: () => void
    total: () => number
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                const exists = get().items.find(i => i.trackId === item.trackId);
                if (exists) return; // Prevent duplicates for now
                set({ items: [...get().items, item], isOpen: true })
            },

            removeItem: (trackId) =>
                set({
                    items: get().items.filter(i => i.trackId !== trackId),
                }),

            clearCart: () => set({ items: [] }),

            total: () =>
                get().items.reduce((sum, i) => sum + i.price, 0),

            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
        }),
        { name: 'cart-store' }
    )
)
