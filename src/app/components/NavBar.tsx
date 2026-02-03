'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import Logo from '../assets/LOGO.png'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'

const NAV_LINKS = [
    { name: 'Beats', href: '/tracks' },
    { name: 'Licensing', href: '/licensing' },
    { name: 'Explore', href: '/home' },
    { name: 'About Me', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
]

export function NavBar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isProfileOpen, setIsProfileOpen] = React.useState(false) // For desktop dropdown
    const [mounted, setMounted] = React.useState(false)

    // Connect to Stores
    const { toggleCart, items } = useCartStore()
    const { user, logout } = useAuthStore()
    const cartCount = items.length

    const router = useRouter()
    const pathname = usePathname()

    React.useEffect(() => setMounted(true), [])

    // Prevent background scroll when sidebar is open
    React.useEffect(() => {
        if (window.innerWidth < 768) { // Only on mobile
            document.body.style.overflow = isOpen ? 'hidden' : ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsOpen(false)
        setIsProfileOpen(false)
    }, [pathname])

    if (pathname === '/login' || pathname === '/register') return null

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        logout()
        router.refresh()
        router.push('/')
        setIsOpen(false)
        setIsProfileOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-white/80 backdrop-blur-md dark:bg-background-dark/80">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6 relative">
                {/* Logo + Menu Toggle */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="rounded-md p-2 text-slate-700 md:hidden dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        aria-label={isOpen ? "Close Menu" : "Open Menu"}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

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
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(link => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm uppercase font-medium text-slate-700 hover:text-doz-red dark:text-slate-200 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Cart (Right) */}
                <button
                    onClick={toggleCart}
                    className="relative flex items-center justify-center p-2 text-slate-700 md:hidden dark:text-white"
                >
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-doz-red text-[10px] font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={toggleCart}
                        className="relative p-2 text-slate-700 hover:text-doz-red dark:text-white transition-colors"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-doz-red text-[10px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Auth UI */}
                    {mounted && (
                        user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-doz-red hover:text-doz-red dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-doz-red transition-all"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Profile</span>
                                    <ChevronDown className={`h-3 w-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-bold text-white hover:bg-doz-red dark:bg-white dark:text-black dark:hover:bg-doz-red dark:hover:text-white transition-colors">
                                    Login
                                </button>
                            </Link>
                        )
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown (Opens BELOW navbar now) */}
            <div
                className={`absolute left-0 right-0 top-full z-40 overflow-hidden bg-white shadow-xl transition-all duration-300 md:hidden dark:bg-[#0a0a0a] dark:border-b dark:border-white/5 ${isOpen ? 'max-h-[90vh] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-col p-4">
                    {/* Navigation Links */}
                    <nav className="flex flex-col space-y-1">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-doz-red dark:text-slate-200 dark:hover:bg-white/5"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="my-4 h-px w-full bg-slate-100 dark:bg-white/10" />

                    {/* Mobile Auth Actions */}
                    <div className="px-2">
                        {mounted && (
                            user ? (
                                <div className="space-y-2">
                                    <div className="mb-4 flex items-center gap-3 px-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
                                            <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">Account</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/dashboard"
                                        className="flex w-full items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 dark:bg-white/5 dark:text-white"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-lg border border-red-100 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <button className="w-full rounded-xl bg-doz-red py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-doz-red/20 active:scale-[0.98]">
                                        Log In
                                    </button>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Backdrop for Mobile Menu (Click outside to close) */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 top-[60px] z-30 bg-black/60 backdrop-blur-sm md:hidden"
                />
            )}
        </nav>
    )
}
