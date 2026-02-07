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
    coupon: { code: string; discountPercent: number; discountAmount: number } | null
    applyCoupon: (data: { code: string; discountPercent: number }) => void
    removeCoupon: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            coupon: null,

            addItem: (item) => {
                const items = get().items;
                const existingIndex = items.findIndex(i => i.trackId === item.trackId);

                if (existingIndex !== -1) {
                    const existingItem = items[existingIndex];
                    if (existingItem.licenseId === item.licenseId) {
                        return;
                    }
                    const newItems = [...items];
                    newItems[existingIndex] = item;
                    // Recalculate discount if coupon exists
                    const currentCoupon = get().coupon;
                    if (currentCoupon) {
                        const subtotal = newItems.reduce((sum, i) => sum + i.price, 0);
                        const discountAmount = Math.floor(subtotal * (currentCoupon.discountPercent / 100));
                        set({ items: newItems, isOpen: true, coupon: { ...currentCoupon, discountAmount } });
                    } else {
                        set({ items: newItems, isOpen: true });
                    }
                } else {
                    const newItems = [...items, item];
                    const currentCoupon = get().coupon;
                    if (currentCoupon) {
                        const subtotal = newItems.reduce((sum, i) => sum + i.price, 0);
                        const discountAmount = Math.floor(subtotal * (currentCoupon.discountPercent / 100));
                        set({ items: newItems, isOpen: true, coupon: { ...currentCoupon, discountAmount } });
                    } else {
                        set({ items: newItems, isOpen: true });
                    }
                }
            },

            removeItem: (trackId) => {
                const newItems = get().items.filter(i => i.trackId !== trackId);
                const currentCoupon = get().coupon;
                if (currentCoupon) {
                    const subtotal = newItems.reduce((sum, i) => sum + i.price, 0);
                    const discountAmount = Math.floor(subtotal * (currentCoupon.discountPercent / 100));
                    set({ items: newItems, coupon: { ...currentCoupon, discountAmount } });
                } else {
                    set({ items: newItems });
                }
            },

            clearCart: () => set({ items: [], coupon: null }),

            // Total is now the FINAL amount
            total: () => {
                const state = get();
                const sub = state.items.reduce((sum, i) => sum + i.price, 0);
                if (state.coupon) {
                    return Math.max(0, sub - state.coupon.discountAmount);
                }
                return sub;
            },

            // Subtotal for display
            subtotal: () => get().items.reduce((sum, i) => sum + i.price, 0),

            applyCoupon: (data) => {
                const sub = get().items.reduce((sum, i) => sum + i.price, 0);
                const discountAmount = Math.floor(sub * (data.discountPercent / 100));
                set({ coupon: { code: data.code, discountPercent: data.discountPercent, discountAmount } });
            },

            removeCoupon: () => set({ coupon: null }),

            toggleCart: () => set({ isOpen: !get().isOpen }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
        }),
        { name: 'cart-store' }
    )
)
