import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * ShopPage — Page Object for the product listing page (/).
 *
 * Encapsulates all interactions and assertions specific to the shop listing,
 * including searching, filtering by category, sorting, and adding items.
 */
export class ShopPage extends BasePage {
  readonly searchInput: Locator
  readonly productGrid: Locator
  readonly filterBar: Locator
  readonly sortSelect: Locator
  readonly resultCount: Locator
  readonly emptyResults: Locator

  constructor(page: Page) {
    super(page)
    this.searchInput = page.getByTestId('search-input')
    this.productGrid = page.getByTestId('product-grid')
    this.filterBar = page.getByTestId('filter-bar')
    this.sortSelect = page.getByTestId('sort-select')
    this.resultCount = page.getByTestId('result-count')
    this.emptyResults = page.getByTestId('empty-results')
  }

  /** Navigate to the shop homepage */
  async goto(category?: string) {
    const url = category ? `/?category=${encodeURIComponent(category)}` : '/'
    await super.goto(url)
  }

  // ─── Products ────────────────────────────────────────────────────────────────

  /** All visible product cards */
  get productCards(): Locator {
    return this.page.getByTestId('product-card')
  }

  /** Product card by index (0-based) */
  productCardAt(index: number): Locator {
    return this.productCards.nth(index)
  }

  /** Product card whose name contains the given text */
  productCardByName(name: string): Locator {
    return this.productCards.filter({ hasText: name })
  }

  // ─── Search ──────────────────────────────────────────────────────────────────

  async search(query: string) {
    await this.searchInput.fill(query)
    // The filter is reactive; give React a tick to update
    await this.page.waitForTimeout(100)
  }

  async clearSearch() {
    await this.searchInput.clear()
    await this.page.waitForTimeout(100)
  }

  // ─── Filters ─────────────────────────────────────────────────────────────────

  /**
   * Click a category filter button.
   * The testid uses the category name with spaces→dashes and & → and.
   */
  async filterByCategory(category: string) {
    const testId = `filter-${category.replace(/\s+/g, '-').replace('&', 'and')}`
    await this.page.getByTestId(testId).click()
    await this.page.waitForTimeout(100)
  }

  async sortBy(value: 'featured' | 'price-asc' | 'price-desc' | 'rating') {
    await this.sortSelect.selectOption(value)
    await this.page.waitForTimeout(100)
  }

  // ─── Cart ────────────────────────────────────────────────────────────────────

  /** Click "Add to Cart" on the first visible product card */
  async addFirstProductToCart() {
    await this.productCards
      .first()
      .getByTestId('add-to-cart-btn')
      .click()
  }

  /** Click "Add to Cart" on the card whose name contains the given string */
  async addProductToCart(name: string) {
    await this.productCardByName(name)
      .getByTestId('add-to-cart-btn')
      .click()
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async expectProductCount(count: number) {
    await expect(this.productCards).toHaveCount(count)
  }

  async expectEmptyResults() {
    await expect(this.emptyResults).toBeVisible()
    await expect(this.productGrid).not.toContainText('product-card')
  }

  async expectResultCountText(count: number) {
    await expect(this.resultCount).toContainText(`${count} product`)
  }

  /** Assert the active category filter button is visually selected */
  async expectActiveCategoryFilter(category: string) {
    const testId = `filter-${category.replace(/\s+/g, '-').replace('&', 'and')}`
    await expect(this.page.getByTestId(testId)).toHaveAttribute('aria-pressed', 'true')
  }
}
