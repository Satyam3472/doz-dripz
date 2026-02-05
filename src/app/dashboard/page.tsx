
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Library,
    ShoppingBag,
    User,
    Settings,
    Search,
    Bell,
    UploadCloud,
    Filter,
    LayoutGrid, // For "Sort" icon map (Material 'grid_view' ~ LayoutGrid/Grid)
    Play,
    Download,
    Music,
    LogOut,
    Menu,
    X
} from "lucide-react";
import DashboardPlayer from "../components/DashboardPlayer";
import { usePlayerStore } from "@/stores/player.store";
import Logo from "../assets/LOGO.png"

// Types
interface Purchase {
    id: number;
    trackId: string;
    trackName: string;
    artist: string;
    licenseType: string;
    amount: number;
    fileUrl: string;
    invoiceUrl: string; // or null
    createdAt: string;
    cover: string | null;
}

export default function DashboardPage() {
    const router = useRouter();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Player Store
    const { setQueue, play } = usePlayerStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/dashboard/purchases");
                if (res.status === 401) {
                    router.push("/login?redirect=/dashboard");
                    return;
                }
                const data = await res.json();
                setPurchases(data.purchases || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleDownload = (url: string, filename: string) => {
        if (!url) {
            alert("File not available.");
            return;
        }
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const handlePlay = (purchase: Purchase, index: number) => {
        // Map purchases to Track format expected by player
        const queue = purchases.map(p => ({
            id: Number(p.trackId),
            title: p.trackName,
            artist: p.artist || "DOZ DRIPZ",
            audioUrl: p.fileUrl,
            cover: p.cover || "/assets/LOGO.png",
            price: p.amount
        }));

        setQueue(queue, index);
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white font-display">Loading Dashboard...</div>;
    }

    return (
        <div className="flex min-h-screen bg-[#0A0A0A] font-sans text-white selection:bg-[#E11D48]/30 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#121212]/90 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between gap-3 mb-10">
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
                            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                DOZ <span className="text-doz-red">DRIPZ</span>
                            </h1>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="space-y-2 flex-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white transition-all group bg-gradient-to-r from-[#E11D48]/10 to-transparent border-l-[3px] border-[#E11D48]">
                            <Library className="text-[#E11D48]" size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">My Library</span>
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-all group hover:bg-white/5 text-left">
                            <LogOut className="group-hover:text-[#E11D48] transition-colors" size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
                        </button>
                    </nav>

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full md:ml-64 relative h-screen overflow-y-auto pb-40">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 px-4 backdrop-blur-md md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <Menu size={24} />
                    </button>
                    <span className="text-sm font-bold uppercase tracking-widest">My Library</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-white">My Library</h2>
                            <p className="text-xs md:text-sm text-white/40 uppercase tracking-[0.2em] font-bold">{purchases.length} Beats Purchased</p>
                        </div>
                        {/* Search on Desktop */}
                        <div className="relative w-full max-w-xs hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <input className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/20 focus:border-[#E11D48]/50 outline-none transition-colors" placeholder="Search..." type="text" />
                        </div>
                    </div>

                    {/* Desktop Search (Mobile Only View? No, keeping clean) */}

                    {/* Grid */}
                    {purchases.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-white/50 text-sm md:text-lg">No purchases found.</p>
                            <Link href="/" className="mt-4 inline-block text-[#E11D48] font-bold uppercase tracking-widest hover:underline text-xs md:text-sm">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {purchases.map((purchase, index) => (
                                <div key={purchase.id} className="group relative rounded-xl bg-[#121212] border border-white/5 p-3 hover:border-[#E11D48]/30 transition-all hover:-translate-y-1">
                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black mb-3">
                                        {purchase.cover ? (
                                            <Image
                                                src={purchase.cover}
                                                alt={purchase.trackName}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                                                <Music size={32} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handlePlay(purchase, index)}
                                                className="h-10 w-10 rounded-full bg-[#E11D48] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <Play className="fill-current ml-0.5" size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1 mb-3">
                                        <h3 className="text-sm font-bold text-white truncate">{purchase.trackName}</h3>
                                        <p className="text-[10px] text-white/50 uppercase tracking-wider truncate">{purchase.artist}</p>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[9px] font-bold text-[#E11D48] bg-[#E11D48]/10 px-2 py-1 rounded uppercase truncate">{purchase.licenseType}</span>
                                        <button
                                            onClick={() => handleDownload(purchase.fileUrl, `${purchase.trackName}.mp3`)}
                                            className="text-white/40 hover:text-white transition-colors"
                                            title="Download"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recent Downloads Table (Desktop Only / Hide on Mobile for compactness?) */}
                    {/* The user wants "Highly responsive and compact". Tables are bad on mobile. Let's hide table on mobile or adapt it. */}
                    <div className="hidden md:block">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-4 text-white">Recent History</h3>
                        <div className="overflow-hidden rounded-xl border border-white/5 bg-[#121212]">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
                                    <tr>
                                        <th className="px-6 py-4">Track</th>
                                        <th className="px-6 py-4">License</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {purchases.map((purchase) => (
                                        <tr key={purchase.id + '_recent'} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-3 font-bold text-white">{purchase.trackName}</td>
                                            <td className="px-6 py-3 text-xs text-white/60 uppercase">{purchase.licenseType}</td>
                                            <td className="px-6 py-3 text-xs text-white/40">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => handleDownload(purchase.fileUrl, `${purchase.trackName}.mp3`)}
                                                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-[#E11D48] hover:text-white transition-colors"
                                                >
                                                    <Download size={14} /> Re-download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Fixed Media Player */}
            <DashboardPlayer />
        </div>
    );
}
