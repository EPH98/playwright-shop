'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById, products } from '@/data/products'
import { useCartStore } from '@/store/cart'
import { ProductCard } from '@/components/ProductCard'

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    if (!product.inStock) return
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(product.price)

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div data-testid="product-detail">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div data-testid="product-breadcrumb" className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/?category=${encodeURIComponent(product.category)}`}
            className="hover:text-ink transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-ink truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden bg-surface-alt border border-border">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-detail-image"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="tag mb-3 inline-block">{product.category}</span>
              <h1
                className="font-display text-3xl md:text-4xl font-bold leading-tight"
                data-testid="product-detail-name"
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={star <= Math.round(product.rating) ? '#B83A10' : 'none'}
                      stroke="#B83A10"
                      strokeWidth="1.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted font-mono">
                  {product.rating} · {product.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-mono text-3xl font-bold"
                data-testid="product-detail-price"
              >
                {formattedPrice}
              </span>
              {product.inStock ? (
                <span className="text-xs font-mono text-green-700 tracking-wider uppercase">
                  ✓ In Stock
                </span>
              ) : (
                <span className="text-xs font-mono text-muted tracking-wider uppercase">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p
              className="text-muted leading-relaxed"
              data-testid="product-detail-description"
            >
              {product.longDescription}
            </p>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Quantity + Add */}
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-border" data-testid="quantity-selector">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-alt transition-colors disabled:opacity-40"
                  data-testid="quantity-decrease"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  className="w-12 text-center font-mono text-sm font-bold"
                  data-testid="quantity-value"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-alt transition-colors"
                  data-testid="quantity-increase"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`btn-primary flex-1 text-center ${added ? 'bg-green-700 hover:bg-green-700' : ''}`}
                data-testid="add-to-cart-detail"
              >
                {added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* View cart link */}
            <Link
              href="/cart"
              className="text-sm text-muted underline underline-offset-4 hover:text-ink transition-colors text-center"
            >
              View cart →
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-6 mb-8">
              <h2 className="font-display text-2xl font-bold">More in {product.category}</h2>
              <div className="flex-1 border-t border-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
