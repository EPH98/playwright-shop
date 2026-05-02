import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * CartPage — Page Object for the /cart route.
 *
 * Covers all interactions with the cart: viewing items, adjusting quantities,
 * removing items, and proceeding to checkout.
 */
export class CartPage extends BasePage {
  readonly cartPage: Locator
  readonly emptyCart: Locator
  readonly cartItems: Locator
  readonly cartTotal: Locator
  readonly cartSubtotal: Locator
  readonly checkoutBtn: Locator
  readonly continueShopping: Locator
  readonly clearCartBtn: Locator

  constructor(page: Page) {
    super(page)
    this.cartPage = page.getByTestId('cart-page')
    this.emptyCart = page.getByTestId('empty-cart')
    this.cartItems = page.getByTestId('cart-items')
    this.cartTotal = page.getByTestId('cart-total')
    this.cartSubtotal = page.getByTestId('cart-subtotal')
    this.checkoutBtn = page.getByTestId('checkout-btn')
    this.continueShopping = page.getByTestId('continue-shopping')
    this.clearCartBtn = page.getByTestId('clear-cart')
  }

  async goto() {
    await super.goto('/cart')
  }

  // ─── Item locators ───────────────────────────────────────────────────────────

  /** All cart item rows */
  get items(): Locator {
    return this.page.getByTestId('cart-item')
  }

  /** Cart item row for a specific product ID */
  itemByProductId(productId: string): Locator {
    return this.page.locator(`[data-testid="cart-item"][data-product-id="${productId}"]`)
  }

  /** The quantity display inside a given item row */
  itemQuantity(productId: string): Locator {
    return this.itemByProductId(productId).getByTestId('cart-item-quantity')
  }

  // ─── Quantity controls ───────────────────────────────────────────────────────

  async increaseItemQuantity(productId: string) {
    await this.itemByProductId(productId).getByTestId('quantity-increase').click()
  }

  async decreaseItemQuantity(productId: string) {
    await this.itemByProductId(productId).getByTestId('quantity-decrease').click()
  }

  async removeItem(productId: string) {
    await this.itemByProductId(productId).getByTestId('remove-item').click()
  }

  async clearCart() {
    await this.clearCartBtn.click()
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  async expectEmpty() {
    await expect(this.emptyCart).toBeVisible()
  }

  async expectNotEmpty() {
    await expect(this.emptyCart).not.toBeVisible()
    await expect(this.items.first()).toBeVisible()
  }

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count)
  }

  async expectItemQuantity(productId: string, qty: number) {
    await expect(this.itemQuantity(productId)).toHaveText(String(qty))
  }

  async expectTotalContains(text: string) {
    await expect(this.cartTotal).toContainText(text)
  }

  async expectCheckoutAvailable() {
    await expect(this.checkoutBtn).toBeVisible()
    await expect(this.checkoutBtn).toBeEnabled()
  }
}
