import Link from "next/link";
import { CheckCircle2, Music4 } from "lucide-react";

export default function PaymentSuccessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-white p-4">
            <div className="w-full max-w-md space-y-8 text-center bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center animate-in zoom-in duration-500">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">Payment Successful!</h1>
                    <p className="text-white/50">
                        Thank you for your purchase. Your payment has been verified and your licenses have been assigned.
                    </p>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <Link
                        href="/profile"
                        className="group relative w-full overflow-hidden rounded-xl bg-doz-red px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-doz-red/90 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Music4 size={18} />
                            View My Tracks
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
