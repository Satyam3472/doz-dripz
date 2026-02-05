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
                const items = get().items;
                const existingIndex = items.findIndex(i => i.trackId === item.trackId);

                if (existingIndex !== -1) {
                    const existingItem = items[existingIndex];
                    // If same track and same license, ignore (or could increase quantity if we supported it)
                    if (existingItem.licenseId === item.licenseId) {
                        return;
                    }

                    // If same track but different license, replace it
                    const newItems = [...items];
                    newItems[existingIndex] = item;
                    set({ items: newItems, isOpen: true });
                } else {
                    // New track
                    set({ items: [...items, item], isOpen: true });
                }
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
