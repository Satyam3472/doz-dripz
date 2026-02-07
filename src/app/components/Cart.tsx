import { useCartStore } from "@/stores/cart.store";
import { X, ShoppingBasket, Trash2, ArrowRight, Loader2, Tag, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Script from "next/script";


export default function Cart() {
    const { items, removeItem, total, subtotal, isOpen, closeCart, clearCart, coupon, applyCoupon, removeCoupon } = useCartStore();
    const pathname = usePathname();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponError, setCouponError] = useState("");

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCouponInput("");
            setCouponError("");
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError("");

        try {
            const res = await fetch("/api/coupons/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponInput, cartTotal: subtotal() }),
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                applyCoupon({ code: data.code, discountPercent: data.discountPercent });
                setCouponInput(""); // Clear input on success
            } else {
                setCouponError(data.error || "Invalid coupon");
            }

        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError("Failed to apply coupon");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // 1. Create Order
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, couponCode: coupon?.code }), // Send coupon code
            });

            if (!res.ok) {
                const error = await res.json();
                if (res.status === 401) {
                    // Redirect to login if unauthorized
                    closeCart();
                    router.push("/login?redirect=/checkout"); // ideally preserve cart
                    return;
                }
                throw new Error(error.error || "Failed to create order");
            }

            const order = await res.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "DOZ DRIPZ",
                description: "Purchase Tracks",
                image: "/assets/LOGO.png",
                order_id: order.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                items,
                                couponCode: coupon?.code // Pass here too for consistency check
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            clearCart();
                            closeCart();
                            router.push("/payment-success");
                        } else {
                            alert("Payment success but verification failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Payment verification error");
                    }
                },

                prefill: {
                    name: order.user?.name,
                    email: order.user?.email,
                    contact: order.user?.contact
                },
                config: {
                    display: {
                        blocks: {
                            banks: {
                                name: "Pay using",
                                instruments: [
                                    {
                                        method: "upi"
                                    },
                                    {
                                        method: "card"
                                    },
                                    {
                                        method: "netbanking"
                                    }
                                ],
                            },
                        },
                        sequence: ["block.banks"],
                        preferences: {
                            show_default_blocks: false,
                        },
                    },
                },
                theme: {
                    color: "black", // doz-red
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
                setIsProcessing(false);
            });
            rzp1.open();

        } catch (error: any) {
            console.error("Checkout error:", error);
            alert(error.message || "Something went wrong");
            setIsProcessing(false);
        }
    };

    if (!isOpen || pathname === '/login' || pathname === '/register') return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
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
                                    {item.cover ? (
                                        <Image
                                            alt={`${item.title} cover`}
                                            src={item.cover}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white/20">?</div>
                                    )}
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
                                        <span className="font-black text-sm text-white">₹{item.price}</span>
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
                            <span className="font-bold">₹{subtotal().toFixed(2)}</span>
                        </div>

                        {/* Coupon Section */}
                        {coupon ? (
                            <div className="flex items-center justify-between bg-doz-red/10 border border-doz-red/20 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-doz-red" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">{coupon.code}</p>
                                        <p className="text-[10px] text-doz-red">-{coupon.discountPercent}% Discount</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-doz-red">-₹{coupon.discountAmount.toFixed(2)}</span>
                                    <button onClick={removeCoupon} className="text-white/50 hover:text-white">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-doz-red focus:border-doz-red placeholder:text-white/20 text-white outline-none"
                                    placeholder="Discount Code"
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    // Handle Enter key
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon || !couponInput.trim()}
                                    className="absolute right-2 top-2 px-3 py-1 text-[10px] font-bold uppercase bg-white/10 hover:bg-white/20 rounded transition-colors text-white disabled:opacity-50"
                                >
                                    {isApplyingCoupon ? <Loader2 className="animate-spin h-3 w-3" /> : 'Apply'}
                                </button>
                            </div>
                        )}
                        {couponError && <p className="text-xs text-red-500 font-medium pl-1">{couponError}</p>}

                        <div className="flex justify-between items-end pt-2 border-t border-white/10">
                            <span className="text-sm font-bold uppercase tracking-widest text-white/50">Total</span>
                            <span className="text-3xl font-black tracking-tight text-white">₹{total().toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="w-full bg-doz-red hover:bg-doz-red/90 text-white font-black py-4 rounded-xl shadow-[0_0_30px_rgba(127,19,236,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Checkout
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-center text-white/30 uppercase tracking-tighter">
                            Secure checkout powered by Razorpay
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
