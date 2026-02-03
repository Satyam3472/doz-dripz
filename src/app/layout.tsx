import type { Metadata } from 'next'
import { Inter, Spline_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { NavBar } from './components/NavBar'
import Footer from './components/Footer'
import Cart from './components/Cart'

const inter = Inter({ subsets: ['latin'] })
const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-spline-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Doz Dripz - Premium Beats',
  description: 'High quality beats for artists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=graphic_eq,dark_mode,light_mode,shopping_cart" />
      </head>
      <body className={`${inter.className} ${splineSans.variable}`}>
        <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NavBar />
          <Cart />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
