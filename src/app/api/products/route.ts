import { NextResponse } from 'next/server'
import { products, categories } from '@/data/products'

/**
 * GET /api/products
 * 
 * Returns all products or filtered by category.
 * Query params:
 *   - category: Filter by category name (optional)
 * 
 * Response: { products: Product[], categories: string[] }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryFilter = searchParams.get('category')

  // Simulate a small amount of processing time (realistic API behavior)
  await new Promise((resolve) => setTimeout(resolve, 10))

  const filtered = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products

  return NextResponse.json({
    products: filtered,
    categories,
    total: filtered.length,
  })
}
