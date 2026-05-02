import { test as base, expect } from '@playwright/test'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'

/**
 * Custom fixture types.
 *
 * Extending Playwright's base `test` with typed Page Object fixtures means
 * every spec file gets auto-instantiated, fully typed page objects with zero
 * boilerplate.  Add new page objects here as the app grows.
 */
type PageFixtures = {
  shopPage: ShopPage
  productPage: ProductPage
  cartPage: CartPage
}

/**
 * The extended `test` function.
 *
 * Import this instead of `@playwright/test` in every spec file:
 *
 *   import { test, expect } from '../fixtures'
 *
 * Fixtures are scoped to each test — a fresh instance per test, no shared
 * state between tests.
 */
export const test = base.extend<PageFixtures>({
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page))
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page))
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page))
  },
})

export { expect }
