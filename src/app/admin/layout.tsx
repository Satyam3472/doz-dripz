import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from "@/app/lib/db";
import Link from "next/link";
import {
    LayoutDashboard,
    ListMusic,
    ShoppingCart,
    BarChart3,
    Settings,
    Music,
    Tv, // For "Home Content"
    HardDrive
} from "lucide-react";
import Image from "next/image";
import Logo from "../assets/LOGO.png"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session")?.value;

    if (!sessionId) {
        redirect("/login");
    }

    const session = db.prepare(`
        SELECT users.role 
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        WHERE sessions.id = ? AND sessions.expires_at > ?
    `).get(sessionId, new Date().toISOString()) as { role: string } | undefined;

    if (!session || (session.role !== 'ADMIN' && session.role !== 'MUSICIAN')) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-[#0A0A0A] font-sans text-white selection:bg-[#EC1313]/30">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[#262626] bg-[#121212] flex flex-col justify-between p-8">
                <div className="flex flex-col gap-10">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
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
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                            <LayoutDashboard size={20} className="group-hover:text-white transition-colors" />
                            <span>Dashboard</span>
                        </Link>
                        <Link href="/admin/tracks" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                            <ListMusic size={20} className="group-hover:text-white transition-colors" />
                            <span>Manage Beats</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                            <Tv size={20} className="group-hover:text-white transition-colors" />
                            <span>Home Content</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                            <ShoppingCart size={20} className="group-hover:text-white transition-colors" />
                            <span>Orders</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                            <BarChart3 size={20} className="group-hover:text-white transition-colors" />
                            <span>Analytics</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-4 py-3 text-[#A3A3A3] hover:text-white hover:bg-white/5 transition-all rounded-lg text-sm font-medium group">
                            <Settings size={20} className="group-hover:text-white transition-colors" />
                            <span>Settings</span>
                        </Link>
                    </nav>
                </div>

                {/* Storage Widget */}
                <div className="px-4 py-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-2">Storage</p>
                    <div className="h-1.5 w-full bg-white/10 rounded-full mb-2">
                        <div className="h-full w-2/3 bg-white/40 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-white/60">6.4 GB of 10 GB used</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10 bg-[#0A0A0A]">
                {children}
            </main>
        </div>
    );
}
