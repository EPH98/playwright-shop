import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const copyrightYear = new Date().getFullYear()

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Workspace — Premium Desk Setup',
  description: 'Curated tools for makers and creators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="font-body bg-cream text-ink antialiased min-h-screen">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-border mt-24 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <span className="font-display text-xl font-bold tracking-tight">The Workspace</span>
              <p className="text-muted text-sm mt-2 max-w-xs">
                Curated tools and equipment for those who take their environment seriously.
              </p>
            </div>
            <div className="flex gap-12 text-sm text-muted">
              <div className="flex flex-col gap-2">
                <span className="text-ink font-medium">Shop</span>
                <a href="/" className="hover:text-ink transition-colors">All Products</a>
                <a href="/?category=Keyboards" className="hover:text-ink transition-colors">Keyboards</a>
                <a href="/?category=Accessories" className="hover:text-ink transition-colors">Accessories</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-ink font-medium">Support</span>
                <a href="#" className="hover:text-ink transition-colors">Shipping</a>
                <a href="#" className="hover:text-ink transition-colors">Returns</a>
                <a href="#" className="hover:text-ink transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-border flex justify-between items-center">
            <p className="text-xs text-muted font-mono">© {copyrightYear} The Workspace. All rights reserved.</p>
            <p className="text-xs text-muted font-mono">Playwright-powered QA</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
