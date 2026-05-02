import { Page, Locator, expect } from '@playwright/test'

/**
 * BasePage — shared building block for all Page Object classes.
 *
 * Holds common navigation helpers and shared locators (header, cart icon)
 * so that every specialised page can extend it without duplication.
 */
export class BasePage {
  readonly page: Page

  // Shared UI elements present on every page
  readonly logo: Locator
  readonly cartIcon: Locator
  readonly cartCount: Locator
  readonly header: Locator

  constructor(page: Page) {
    this.page = page
    this.header = page.getByTestId('header')
    this.logo = page.getByTestId('site-logo')
    this.cartIcon = page.getByTestId('cart-icon')
    this.cartCount = page.getByTestId('cart-count')
  }

  /** Navigate to an arbitrary path */
  async goto(path: string = '/') {
    await this.page.goto(path)
  }

  /** Get the document <title> */
  async getTitle(): Promise<string> {
    return this.page.title()
  }

  /**
   * Navigate to cart via the header icon.
   * Returns a CartPage so callers can chain assertions.
   */
  async openCart() {
    await this.cartIcon.click()
    await this.page.waitForURL('**/cart')
  }

  /**
   * Verify the cart badge shows the expected count.
   * Pass 0 to assert the badge is NOT rendered.
   */
  async expectCartCount(count: number) {
    if (count === 0) {
      await expect(this.cartCount).not.toBeVisible()
    } else {
      await expect(this.cartCount).toBeVisible()
      await expect(this.cartCount).toHaveText(String(count))
    }
  }

  /** Click the site logo and assert we land on the homepage */
  async clickLogo() {
    await this.logo.click()
    await this.page.waitForURL('**/')
  }
}
