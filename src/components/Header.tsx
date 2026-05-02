'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCartStore(
    (s) => s.items.reduce((sum, item) => sum + item.quantity, 0),
  ) 

  // Prevent hydration mismatch by only showing count after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? cartCount : 0

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-border" data-testid="header">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight hover:text-rust transition-colors"
          data-testid="site-logo"
        >
          The Workspace
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/?category=Keyboards" className="text-muted hover:text-ink transition-colors">
            Keyboards
          </Link>
          <Link href="/?category=Stands" className="text-muted hover:text-ink transition-colors">
            Stands
          </Link>
          <Link href="/?category=Lighting" className="text-muted hover:text-ink transition-colors">
            Lighting
          </Link>
          <Link href="/?category=Accessories" className="text-muted hover:text-ink transition-colors">
            Accessories
          </Link>
          <Link href="/?category=Audio+%26+Video" className="text-muted hover:text-ink transition-colors">
            Audio & Video
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 group"
            data-testid="cart-icon"
            aria-label={`Cart, ${count} item${count !== 1 ? 's' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:text-rust transition-colors"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-rust text-white text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full"
                data-testid="cart-count"
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-cream">
          <div className="flex flex-col py-4 px-6 gap-4 text-sm font-medium">
            {['Keyboards', 'Stands', 'Lighting', 'Accessories', 'Audio & Video'].map((cat) => (
              <Link
                key={cat}
                href={`/?category=${encodeURIComponent(cat)}`}
                className="text-muted hover:text-ink transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
