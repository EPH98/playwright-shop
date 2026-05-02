'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 75 ? 0 : 5.99
  const grandTotal = subtotal + shipping

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n)

  const formattedTotal = fmt(subtotal)
  const formattedShipping = shipping === 0 ? 'Free' : fmt(shipping)
  const formattedGrandTotal = fmt(grandTotal)

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-muted font-mono text-sm">Loading cart…</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" data-testid="cart-page">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-10 border-b border-border pb-6">
        <h1 className="font-display text-4xl font-bold">Your Cart</h1>
        {items.length > 0 && (
          <span className="font-mono text-sm text-muted">
            {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div
          className="text-center py-24 flex flex-col items-center gap-6"
          data-testid="empty-cart"
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            className="text-border"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <div>
            <p className="font-display text-3xl font-bold">Your cart is empty</p>
            <p className="text-muted mt-2 text-sm">
              Looks like you haven&apos;t added anything yet.
            </p>
          </div>
          <Link data-testid="continue-shopping" 
                href="/" 
                className="btn-primary mt-4">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0" data-testid="cart-items">
            {items.map((item) => {
              const formattedLinePrice = fmt(item.product.price * item.quantity)

              return (
                <div
                  key={item.product.id}
                  className="flex gap-5 py-6 border-b border-border"
                  data-testid="cart-item"
                  data-product-id={item.product.id}
                >
                  {/* Image */}
                  <Link href={`/products/${item.product.id}`} className="shrink-0">
                    <div className="w-24 h-24 bg-surface-alt border border-border overflow-hidden">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-display font-bold text-lg leading-tight hover:text-rust transition-colors"
                          data-testid="cart-item-name"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-muted text-xs font-mono mt-0.5">
                          {item.product.category}
                        </p>
                      </div>
                      <span
                        className="font-mono font-bold shrink-0"
                        data-testid="cart-item-price"
                      >
                        {formattedLinePrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div
                        className="flex items-center border border-border"
                        data-testid="cart-item-quantity-selector"
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-alt transition-colors"
                          data-testid="quantity-decrease"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          −
                        </button>
                        <span
                          className="w-10 text-center font-mono text-sm font-bold"
                          data-testid="cart-item-quantity"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-alt transition-colors"
                          data-testid="quantity-increase"
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs text-muted hover:text-rust underline underline-offset-2 transition-colors"
                        data-testid="remove-item"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Clear cart */}
            <div className="pt-4">
              <button
                onClick={clearCart}
                className="btn-ghost text-sm text-muted"
                data-testid="clear-cart"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24" data-testid="cart-summary">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono" data-testid="cart-subtotal">
                    {formattedTotal}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {formattedShipping}
                    {shipping === 0 && (
                      <span className="ml-1 text-xs text-green-700">(free over £75)</span>
                    )}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="font-mono" data-testid="cart-total">
                    {formattedGrandTotal}
                  </span>
                </div>
              </div>

              <button
                className="btn-primary w-full mt-6 text-center"
                data-testid="checkout-btn"
                onClick={() => alert('Checkout flow not implemented in this demo.')}
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block text-center text-sm text-muted hover:text-ink underline underline-offset-4 transition-colors mt-4"
                data-testid="continue-shopping"
              >
                ← Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-border flex flex-col gap-2 text-xs text-muted font-mono">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <span>Free 30-day returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📦</span>
                  <span>Free shipping over £75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
