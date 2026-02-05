import type { Metadata } from 'next'
import { Inter, Spline_Sans, Manrope } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })
const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-spline-sans',
  display: 'swap',
})
const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DOZ DRIPZ | Audio Library",
  description: "Premium Beats & Audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
