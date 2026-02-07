
import Link from "next/link";
import {
    LayoutDashboard,
    ListMusic,
    ShoppingCart,
    BarChart3,
    Settings,
    Tv,
    Tag,
    X,
    Plus,
    CirclePlus
} from "lucide-react";
import Image from "next/image";
import Logo from "@/app/assets/LOGO.png";

export default function AdminSidebar({ className, onClose }: { className?: string, onClose?: () => void }) {
    return (
        <aside className={`border-r border-[#262626] bg-[#121212] flex flex-col justify-between p-8 ${className}`}>
            <div className="flex flex-col gap-10">
                {/* Brand */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative h-9 w-9 overflow-hidden rounded-lg shadow-[0_0_15px_rgba(227,27,35,0.4)]">
                            <Image
                                src={Logo}
                                alt="Doz Dripz Logo"
                                fill
                                className="object-cover invert dark:invert-0"
                                priority
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-white text-lg font-extrabold tracking-tight leading-none uppercase">DOZ DRIPZ</h1>
                            <p className="text-[#A3A3A3] text-[10px] font-bold tracking-[0.2em] uppercase">Studio OS</p>
                        </div>
                    </Link>
                    {onClose && (
                        <button onClick={onClose} className="md:hidden text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                    <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <LayoutDashboard size={20} className="group-hover:text-white transition-colors" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/tracks" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <ListMusic size={20} className="group-hover:text-white transition-colors" />
                        <span>Manage Beats</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <ShoppingCart size={20} className="group-hover:text-white transition-colors" />
                        <span>Orders</span>
                    </Link>
                    <Link href="/admin/coupons" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <Tag size={20} className="group-hover:text-white transition-colors" />
                        <span>Coupons</span>
                    </Link>
                    <Link href="/admin/content/licensing" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <Tv size={20} className="group-hover:text-white transition-colors" />
                        <span>Home Content</span>
                    </Link>
                    {/* <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <BarChart3 size={20} className="group-hover:text-white transition-colors" />
                        <span>Analytics</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                        <Settings size={20} className="group-hover:text-white transition-colors" />
                        <span>Settings</span>
                    </Link> */}
                </nav>
            </div>
            <Link
                href="/admin/tracks/new"
                className="group relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#EC1313] to-[#ff4b4b] px-4 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(236,19,19,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,19,19,0.6)] hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap overflow-hidden"
            >
                {/* <div className="absolute inset-0 bg-white/20 translate-y-full blur-lg group-hover:translate-y-0 transition-transform duration-500 rounded-xl" /> */}
                <CirclePlus size={24} className="relative z-10" />
                <span className="relative z-10">Upload Track</span>
            </Link>
            {/* Storage Widget */}
            {/* <div className="px-4 py-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-2">Storage</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full mb-2">
                    <div className="h-full w-2/3 bg-white/40 rounded-full"></div>
                </div>
                <p className="text-[10px] text-white/60">6.4 GB of 10 GB used</p>
            </div> */}
        </aside>
    );
}
