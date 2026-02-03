"use client"
import { useCartStore } from "@/stores/cart.store";
import { X, ShoppingBasket, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Cart() {
    const { items, removeItem, total, isOpen, closeCart } = useCartStore();
    const pathname = usePathname();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || pathname === '/login' || pathname === '/register') return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
                onClick={closeCart}
            />
            <div className="relative w-full max-w-md glass-drawer h-full flex flex-col shadow-2xl bg-[#0f0f0f] border-l border-white/10 animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <ShoppingBasket className="text-doz-red h-6 w-6" />
                        <h2 className="text-xl font-bold tracking-tight text-white">Shopping Cart</h2>
                        <span className="px-2 py-0.5 rounded-full bg-doz-red/20 text-doz-red text-[10px] font-bold">
                            {items.length} ITEMS
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                            <ShoppingBasket size={48} className="opacity-20" />
                            <p className="text-sm font-medium">Your cart is empty</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.trackId} className="flex gap-4 group">
                                <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 relative">
                                    <Image
                                        alt={`${item.title} cover`}
                                        src={item.cover}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-sm tracking-wide text-white">{item.title}</h4>
                                        <button
                                            onClick={() => removeItem(item.trackId)}
                                            className="text-white/30 hover:text-doz-red transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-doz-red mb-1 uppercase tracking-tighter">{item.artist}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[11px] text-white/50 bg-white/5 px-2 py-1 rounded">
                                            {item.licenseName}
                                        </span>
                                        <span className="font-black text-sm text-white">${item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
                        <div className="flex justify-between text-sm text-white">
                            <span className="text-white/50">Subtotal</span>
                            <span className="font-bold">${total().toFixed(2)}</span>
                        </div>
                        <div className="relative">
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-doz-red focus:border-doz-red placeholder:text-white/20 text-white outline-none"
                                placeholder="Discount Code"
                                type="text"
                            />
                            <button className="absolute right-2 top-2 px-3 py-1 text-[10px] font-bold uppercase bg-white/10 hover:bg-white/20 rounded transition-colors text-white">
                                Apply
                            </button>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-sm font-bold uppercase tracking-widest text-white/50">Total</span>
                            <span className="text-3xl font-black tracking-tight text-white">${total().toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-doz-red hover:bg-doz-red/90 text-white font-black py-4 rounded-xl shadow-[0_0_30px_rgba(127,19,236,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                            Checkout
                            <ArrowRight size={20} />
                        </button>
                        <p className="text-[10px] text-center text-white/30 uppercase tracking-tighter">
                            Secure checkout powered by Stripe
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
