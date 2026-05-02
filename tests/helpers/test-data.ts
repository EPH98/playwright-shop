/**
 * Test data helpers — centralise any constants or generators that multiple
 * test files need.  Keeping this here (rather than inline) makes tests more
 * readable and makes data changes a single-file operation.
 */

export const PRODUCTS = {
  keyboard: {
    id: 'mk-001',
    name: 'Architect 65 Mechanical Keyboard',
    price: '£159.00',
    category: 'Keyboards',
    url: '/products/mk-001',
    inStock: true,
  },
  stand: {
    id: 'ms-001',
    name: 'Elevate Pro Monitor Stand',
    price: '£89.00',
    category: 'Stands',
    url: '/products/ms-001',
    inStock: true,
  },
  headphones: {
    id: 'hp-001',
    name: 'Quiet Pro Headphones',
    price: '£249.00',
    category: 'Audio & Video',
    url: '/products/hp-001',
    inStock: true,
  },
  outOfStock: {
    id: 'cm-001',
    name: 'ClearRoute Cable Management Box',
    price: '£34.00',
    category: 'Accessories',
    url: '/products/cm-001',
    inStock: false,
  },
} as const

export const CATEGORIES = [
  'All',
  'Keyboards',
  'Stands',
  'Lighting',
  'Accessories',
  'Audio & Video',
] as const

export const TOTAL_PRODUCT_COUNT = 12

export const CATEGORY_COUNTS: Record<string, number> = {
  All: 12,
  Keyboards: 2,
  Stands: 2,
  Lighting: 1,
  Accessories: 5,
  'Audio & Video': 2,
}

export const SEARCH_QUERIES = {
  withResults: 'keyboard',
  noResults: 'zzz_no_match_xyz_999',
  partialMatch: 'pro',
} as const

/** Free-shipping threshold */
export const FREE_SHIPPING_THRESHOLD = 75
export const SHIPPING_COST = 5.99
