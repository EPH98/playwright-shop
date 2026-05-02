export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  longDescription: string
  imageUrl: string
  rating: number
  reviewCount: number
  inStock: boolean
  tags: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export type Category = 'All' | 'Keyboards' | 'Stands' | 'Accessories' | 'Lighting' | 'Audio & Video'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating'
