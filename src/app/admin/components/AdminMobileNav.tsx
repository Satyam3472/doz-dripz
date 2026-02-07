
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import Image from "next/image";
import Logo from "@/app/assets/LOGO.png";

export default function AdminMobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#121212] border-b border-[#262626] z-40 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="relative h-7 w-7 overflow-hidden rounded-lg shadow-[0_0_10px_rgba(227,27,35,0.4)]">
                        <Image
                            src={Logo}
                            alt="Doz Dripz Logo"
                            fill
                            className="object-cover invert dark:invert-0"
                        />
                    </div>
                    <span className="font-extrabold text-white text-sm uppercase tracking-tight">Admin</span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-white/70 hover:text-white p-2"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Drawer Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#121212] transition-transform duration-300 transform md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <AdminSidebar onClose={() => setIsOpen(false)} className="h-full w-full border-r border-[#262626]" />
            </div>
        </>
    );
}
