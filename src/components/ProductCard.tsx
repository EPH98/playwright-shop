'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(product.price)

  return (
    <article
      className="group card overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
      data-testid="product-card"
      data-category={product.category}
      data-product-id={product.id}
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-surface-alt">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-expo-out"
            data-testid="product-image"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-cream/80 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-muted tracking-widest uppercase">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="tag">{product.category}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex-1 flex flex-col gap-3">
          <div>
            <h3
              className="font-display text-lg font-bold leading-snug group-hover:text-rust transition-colors"
              data-testid="product-name"
            >
              {product.name}
            </h3>
            <p className="text-muted text-sm mt-1 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex" aria-label={`Rating: ${product.rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(product.rating) ? '#B83A10' : 'none'}
                  stroke="#B83A10"
                  strokeWidth="1.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted font-mono">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between border-t border-border pt-4 mt-auto">
        <span
          className="font-mono text-lg font-bold"
          data-testid="product-price"
        >
          {formattedPrice}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`btn-primary text-sm py-2 px-4 ${added ? 'bg-green-700 hover:bg-green-700' : ''}`}
          data-testid="add-to-cart-btn"
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}
