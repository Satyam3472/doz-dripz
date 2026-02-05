"use client"

import { usePathname } from 'next/navigation'
import { NavBar } from './NavBar'
import Footer from './Footer'
import Cart from './Cart'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Define routes where the global Navbar/Footer should be hidden
    // User specifically requested reset-password. 
    // It is common to exclude these on login/register/forgot-password as well if they have standalone layouts.
    // I will include reset-password as requested.
    const hideLayoutRoutes = ['/reset-password', '/forgot-password', '/login', '/register', '/dashboard']
    const shouldHideLayout = hideLayoutRoutes.includes(pathname || '') || pathname?.startsWith('/admin')

    if (shouldHideLayout) {
        return <>{children}</>
    }

    return (
        <>
            <NavBar />
            <Cart />
            {children}
            <Footer />
        </>
    )
}
