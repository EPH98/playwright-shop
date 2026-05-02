import { test, expect } from '../fixtures'
import { TOTAL_PRODUCT_COUNT, CATEGORY_COUNTS, SEARCH_QUERIES } from '../helpers/test-data'

/**
 * Shop listing tests — @regression
 *
 * Covers: initial render, search, category filtering, and sorting.
 */

test.describe('Shop listing @regression', () => {
  test.beforeEach(async ({ shopPage }) => {
    await shopPage.goto()
  })

  // ─── Initial state ───────────────────────────────────────────────────────────

  test('shows all products on initial load', async ({ shopPage }) => {
    await shopPage.expectProductCount(TOTAL_PRODUCT_COUNT)
  })

  test('result count label matches displayed products', async ({ shopPage }) => {
    await shopPage.expectResultCountText(TOTAL_PRODUCT_COUNT)
  })

  test('each product card has a name, price, and add-to-cart button', async ({
    shopPage,
  }) => {
    const cards = shopPage.productCards
    const count = await cards.count()

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await expect(card.getByTestId('product-name')).not.toBeEmpty()
      await expect(card.getByTestId('product-price')).toContainText('£')
      await expect(card.getByTestId('add-to-cart-btn')).toBeVisible()
    }
  })

  // ─── Search ──────────────────────────────────────────────────────────────────

  test('search narrows results in real time', async ({ shopPage }) => {
    await shopPage.search(SEARCH_QUERIES.withResults)
    const count = await shopPage.productCards.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(TOTAL_PRODUCT_COUNT)
  })

  test('search with no matches shows empty state', async ({ shopPage }) => {
    await shopPage.search(SEARCH_QUERIES.noResults)
    await shopPage.expectEmptyResults()
  })

  test('clearing search restores all products', async ({ shopPage }) => {
    await shopPage.search(SEARCH_QUERIES.withResults)
    await shopPage.clearSearch()
    await shopPage.expectProductCount(TOTAL_PRODUCT_COUNT)
  })

  test('search is case-insensitive', async ({ shopPage }) => {
    await shopPage.search('KEYBOARD')
    const lower = await shopPage.productCards.count()

    await shopPage.clearSearch()
    await shopPage.search('keyboard')
    const upper = await shopPage.productCards.count()

    expect(lower).toEqual(upper)
    expect(lower).toBeGreaterThan(0)
  })

  // ─── Category filtering ──────────────────────────────────────────────────────

  test.describe('Category filters', () => {
    for (const [category, expectedCount] of Object.entries(CATEGORY_COUNTS)) {
      test(`"${category}" filter shows ${expectedCount} product(s)`, async ({
        shopPage,
      }) => {
        await shopPage.filterByCategory(category)
        await shopPage.expectProductCount(expectedCount)
        await shopPage.expectResultCountText(expectedCount)
      })
    }
  })

  test('active category filter button has correct aria-pressed state', async ({
    shopPage,
  }) => {
    await shopPage.filterByCategory('Keyboards')
    await shopPage.expectActiveCategoryFilter('Keyboards')
  })

  test('URL updates when a category filter is applied', async ({ shopPage }) => {
    await shopPage.filterByCategory('Lighting')
    await expect(shopPage.page).toHaveURL(/category=Lighting/)
  })

  test('opening the page with a category query param pre-selects that filter', async ({
    shopPage,
  }) => {
    await shopPage.goto('Keyboards')
    await shopPage.expectProductCount(CATEGORY_COUNTS['Keyboards'])
    await shopPage.expectActiveCategoryFilter('Keyboards')
  })

  // ─── Sorting ─────────────────────────────────────────────────────────────────

  test('sort by price ascending puts cheapest product first', async ({
    shopPage,
  }) => {
    await shopPage.sortBy('price-asc')
    const prices = await shopPage.productCards
      .getByTestId('product-price')
      .allTextContents()

    const parsed = prices.map((p) => parseFloat(p.replace(/[£,]/g, '')))
    for (let i = 1; i < parsed.length; i++) {
      expect(parsed[i]).toBeGreaterThanOrEqual(parsed[i - 1])
    }
  })

  test('sort by price descending puts most expensive product first', async ({
    shopPage,
  }) => {
    await shopPage.sortBy('price-desc')
    const prices = await shopPage.productCards
      .getByTestId('product-price')
      .allTextContents()

    const parsed = prices.map((p) => parseFloat(p.replace(/[£,]/g, '')))
    for (let i = 1; i < parsed.length; i++) {
      expect(parsed[i]).toBeLessThanOrEqual(parsed[i - 1])
    }
  })

  // ─── Search + filter combination ─────────────────────────────────────────────

  test('search and category filter can be combined', async ({ shopPage }) => {
    await shopPage.filterByCategory('Accessories')
    const filteredCount = await shopPage.productCards.count()

    await shopPage.search('hub')
    const combinedCount = await shopPage.productCards.count()

    expect(combinedCount).toBeGreaterThan(0)
    expect(combinedCount).toBeLessThanOrEqual(filteredCount)
  })
})
