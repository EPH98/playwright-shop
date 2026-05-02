'use client'

import { categories } from '@/data/products'
import { SortOption } from '@/types'
import clsx from 'clsx'

interface FilterBarProps {
  activeCategory: string
  activeSort: SortOption
  onCategoryChange: (category: string) => void
  onSortChange: (sort: SortOption) => void
  resultCount: number
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
]

export function FilterBar({
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="border-b border-border" data-testid="filter-bar">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Category filters */}
        <div
          className="flex gap-2 flex-wrap flex-1 no-scrollbar"
          role="group"
          aria-label="Filter by category"
          data-testid="category-filters"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={clsx(
                'px-4 py-1.5 text-sm font-medium border transition-all duration-150 whitespace-nowrap',
                activeCategory === cat
                  ? 'bg-ink text-cream border-ink'
                  : 'bg-transparent text-muted border-border hover:border-ink hover:text-ink',
              )}
              data-testid={`filter-${cat.replace(/\s+/g, '-').replace('&', 'and')}`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-muted font-mono whitespace-nowrap" data-testid="result-count">
            {resultCount} product{resultCount !== 1 ? 's' : ''}
          </span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-sm border border-border bg-transparent py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-1 cursor-pointer"
            data-testid="sort-select"
            aria-label="Sort products"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
