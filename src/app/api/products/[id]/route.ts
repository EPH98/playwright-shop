import { NextResponse } from 'next/server'
import { getProductById } from '@/data/products'

/**
 * GET /api/products/[id]
 * 
 * Returns a single product by ID, or 404 if not found.
 * 
 * Response: Product | { error: string }
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Simulate a small amount of processing time (realistic API behavior)
  await new Promise((resolve) => setTimeout(resolve, 10))

  const product = getProductById(params.id)

  if (!product) {
    return NextResponse.json(
      { error: `Product with ID "${params.id}" not found` },
      { status: 404 }
    )
  }

  return NextResponse.json(product)
}
