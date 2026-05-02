import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * ProductPage — Page Object for individual product detail pages.
 *
 * Covers quantity selection, add-to-cart, and all assertions specific
 * to the /products/[id] route.
 */
export class ProductPage extends BasePage {
  readonly productDetail: Locator
  readonly productName: Locator
  readonly productPrice: Locator
  readonly productDescription: Locator
  readonly productImage: Locator

  // Quantity controls
  readonly quantityDecrease: Locator
  readonly quantityIncrease: Locator
  readonly quantityValue: Locator

  // CTA
  readonly addToCartBtn: Locator

  constructor(page: Page) {
    super(page)
    this.productDetail = page.getByTestId('product-detail')
    this.productName = page.getByTestId('product-detail-name')
    this.productPrice = page.getByTestId('product-detail-price')
    this.productDescription = page.getByTestId('product-detail-description')
    this.productImage = page.getByTestId('product-detail-image')

    this.quantityDecrease = page.getByTestId('quantity-decrease')
    this.quantityIncrease = page.getByTestId('quantity-increase')
    this.quantityValue = page.getByTestId('quantity-value')

    this.addToCartBtn = page.getByTestId('add-to-cart-detail')
  }

  async goto(productId: string) {
    await super.goto(`/products/${productId}`)
  }

  // ─── Quantity ────────────────────────────────────────────────────────────────

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.quantityIncrease.click()
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.quantityDecrease.click()
    }
  }

  async getQuantity(): Promise<number> {
    const text = await this.quantityValue.textContent()
    return parseInt(text ?? '0', 10)
  }

  // ─── Cart interaction ────────────────────────────────────────────────────────

  async addToCart() {
    await this.addToCartBtn.click()
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async expectProductName(name: string) {
    await expect(this.productName).toHaveText(name)
  }

  async expectProductPrice(price: string) {
    await expect(this.productPrice).toHaveText(price)
  }

  async expectQuantity(qty: number) {
    await expect(this.quantityValue).toHaveText(String(qty))
  }

  async expectAddedConfirmation() {
    await expect(this.addToCartBtn).toContainText('Added to Cart')
  }

  async expectOutOfStock() {
    await expect(this.addToCartBtn).toBeDisabled()
  }
}
