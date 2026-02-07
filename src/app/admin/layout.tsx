import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from "@/app/lib/db";
import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/LOGO.png"

import AdminSidebar from "./components/AdminSidebar";
import AdminMobileNav from "./components/AdminMobileNav";

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
            {/* Mobile Nav */}
            <AdminMobileNav />

            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
                <AdminSidebar className="h-full" />
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full md:ml-64 p-4 md:p-10 pt-20 md:pt-10 bg-[#0A0A0A]">
                {children}
            </main>
        </div>
    );
}
