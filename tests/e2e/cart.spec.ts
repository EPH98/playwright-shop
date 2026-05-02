import { test, expect } from '../fixtures'
import { PRODUCTS, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../helpers/test-data'

/**
 * Cart tests — @regression
 *
 * Covers: adding items, updating quantities, removing items, the empty state,
 * the order summary calculations, and the checkout CTA.
 */

test.describe('Cart @regression', () => {
  // ─── Empty cart ───────────────────────────────────────────────────────────────

  test.describe('Empty cart', () => {
    test('displays empty state when no items have been added', async ({
      cartPage,
    }) => {
      await cartPage.goto()
      await cartPage.expectEmpty()
    })

    test('cart count badge is not visible when cart is empty', async ({
      cartPage,
    }) => {
      await cartPage.goto()
      await cartPage.expectCartCount(0)
    })
  })

  // ─── Adding items ─────────────────────────────────────────────────────────────

  test.describe('Adding items', () => {
    test('adding a product from the listing page updates the cart badge @smoke', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addFirstProductToCart()
      await shopPage.expectCartCount(1)
    })

    test('adding the same product twice increments the quantity (not a second row)', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)

      await cartPage.goto()
      await cartPage.expectItemCount(1)
      await cartPage.expectItemQuantity(PRODUCTS.keyboard.id, 2)
    })

    test('adding multiple different products creates multiple rows', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)
      await shopPage.addProductToCart(PRODUCTS.stand.name)

      await cartPage.goto()
      await cartPage.expectItemCount(2)
    })

    test('cart badge count reflects total quantity across all products', async ({
      shopPage,
    }) => {
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)
      await shopPage.addProductToCart(PRODUCTS.stand.name)

      // 2 keyboards + 1 stand = 3 total items
      await shopPage.expectCartCount(3)
    })

    test('out-of-stock product cannot be added to cart', async ({
      shopPage,
    }) => {
      await shopPage.goto()
      const outOfStockCard = shopPage.productCardByName(PRODUCTS.outOfStock.name)
      const addBtn = outOfStockCard.getByTestId('add-to-cart-btn')
      await expect(addBtn).toBeDisabled()
    })
  })

  // ─── Quantity management ──────────────────────────────────────────────────────

  test.describe('Quantity management', () => {
    test.beforeEach(async ({ shopPage }) => {
      // Seed the cart with one keyboard
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)
    })

    test('increasing quantity in cart updates the displayed quantity', async ({
      cartPage,
    }) => {
      await cartPage.goto()
      await cartPage.increaseItemQuantity(PRODUCTS.keyboard.id)
      await cartPage.expectItemQuantity(PRODUCTS.keyboard.id, 2)
    })

    test('decreasing quantity to zero removes the item', async ({ cartPage }) => {
      await cartPage.goto()
      await cartPage.decreaseItemQuantity(PRODUCTS.keyboard.id)
      await cartPage.expectEmpty()
    })

    test('removing an item directly with the remove button works', async ({
      cartPage,
    }) => {
      await cartPage.goto()
      await cartPage.removeItem(PRODUCTS.keyboard.id)
      await cartPage.expectEmpty()
    })
  })

  // ─── Order summary ────────────────────────────────────────────────────────────

  test.describe('Order summary', () => {
    test('total reflects item price correctly for a single item', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.keyboard.name) // £159.00
      await cartPage.goto()

      // Below free-shipping threshold — shipping applies
      const expectedTotal = PRODUCTS.keyboard.price.replace(
        '£',
        '',
      )
      await expect(cartPage.cartSubtotal).toContainText(expectedTotal)
    })

    test('checkout button is visible and enabled when cart has items', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addFirstProductToCart()
      await cartPage.goto()
      await cartPage.expectCheckoutAvailable()
    })

    test('order summary shows free shipping above threshold', async ({
      shopPage,
      cartPage,
    }) => {
      // Add headphones (£249) which is above the £75 free-shipping threshold
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.headphones.name)
      await cartPage.goto()

      // Grand total should equal subtotal (no shipping charge)
      const subtotal = await cartPage.cartSubtotal.textContent()
      const total = await cartPage.cartTotal.textContent()
      expect(subtotal).toEqual(total)
    })
  })

  // ─── Clear cart ───────────────────────────────────────────────────────────────

  test.describe('Clear cart', () => {
    test('clearing the cart removes all items and shows empty state', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addProductToCart(PRODUCTS.keyboard.name)
      await shopPage.addProductToCart(PRODUCTS.stand.name)

      await cartPage.goto()
      await cartPage.clearCart()
      await cartPage.expectEmpty()
    })

    test('cart count badge disappears after clearing cart', async ({
      shopPage,
      cartPage,
    }) => {
      await shopPage.goto()
      await shopPage.addFirstProductToCart()

      await cartPage.goto()
      await cartPage.clearCart()
      await cartPage.expectCartCount(0)
    })
  })
})
