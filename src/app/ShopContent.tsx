'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { products } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'
import { FilterBar } from '@/components/FilterBar'
import { SortOption } from '@/types'

/**
 * ShopContent — the interactive shop listing.
 *
 * Separated from page.tsx so it can be wrapped in <Suspense> at the page
 * level (a Next.js 14 App Router requirement for useSearchParams).
 */
export function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialCategory = searchParams.get('category') || 'All'
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSort, setActiveSort] = useState<SortOption>('featured')

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'All') {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  /**
   * useMemo — CS concept: memoisation.
   * The filter + sort computation only re-runs when its dependencies change.
   * React caches the previous result and skips the work on unrelated renders.
   */
  const filteredAndSorted = useMemo(() => {
    let result = products

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }

    return [...result].sort((a, b) => {
      switch (activeSort) {
        case 'price-asc':  return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating':     return b.rating - a.rating
        default:           return 0
      }
    })
  }, [activeCategory, searchQuery, activeSort])

  return (
    <>
      {/* Hero Banner */}
      <section className="border-b border-border bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <p className="font-mono text-xs tracking-widest uppercase text-muted mb-4">
              — Curated for makers
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none tracking-tight">
              Your Desk,<br />
              <span className="text-rust-light">Elevated.</span>
            </h1>
          </div>
          <div className="md:max-w-xs">
            <p className="text-muted text-sm leading-relaxed">
              Every piece in our collection is tested, evaluated, and chosen for those
              who refuse to compromise on their work environment.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border bg-cream focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-1 placeholder:text-muted"
              data-testid="search-input"
              aria-label="Search products"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        onCategoryChange={handleCategoryChange}
        onSortChange={setActiveSort}
        resultCount={filteredAndSorted.length}
      />

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12" data-testid="product-grid">
        {filteredAndSorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-24 flex flex-col items-center gap-4"
            data-testid="empty-results"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-border"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <div>
              <p className="font-display text-2xl font-bold text-ink">No results found</p>
              <p className="text-muted text-sm mt-2">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('')
                handleCategoryChange('All')
              }}
              className="btn-secondary mt-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}

// Named export above; also provide a default export so page.tsx can import either way
export default ShopContent
