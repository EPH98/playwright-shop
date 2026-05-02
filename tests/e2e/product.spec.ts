import { test, expect } from '../fixtures'
import { PRODUCTS } from '../helpers/test-data'

/**
 * Product detail page tests — @regression
 *
 * Covers: rendering, quantity selector behaviour, add-to-cart flow,
 * and out-of-stock state.
 */

test.describe('Product detail page @regression', () => {
  test.describe('Rendering', () => {
    test('shows product name, price, and description', async ({
      productPage,
    }) => {
      await productPage.goto(PRODUCTS.keyboard.id)

      await productPage.expectProductName(PRODUCTS.keyboard.name)
      await productPage.expectProductPrice(PRODUCTS.keyboard.price)
      await expect(productPage.productDescription).not.toBeEmpty()
    })

    test('product image is visible', async ({ productPage }) => {
      await productPage.goto(PRODUCTS.keyboard.id)
      await expect(productPage.productImage).toBeVisible()
      await expect(productPage.productImage).toHaveAttribute('src', /.+/)
    })

    test('quantity selector starts at 1', async ({ productPage }) => {
      await productPage.goto(PRODUCTS.keyboard.id)
      await productPage.expectQuantity(1)
    })

    test('404 page is shown for an unknown product id', async ({
      productPage,
    }) => {
      await productPage.goto('not-a-real-product')
      // Next.js renders a 404 — the detail element should not be present
      await expect(productPage.productDetail).not.toBeVisible()
    })
  })

  test.describe('Quantity selector', () => {
    test.beforeEach(async ({ productPage }) => {
      await productPage.goto(PRODUCTS.keyboard.id)
    })

    test('increase button increments quantity', async ({ productPage }) => {
      await productPage.increaseQuantity(2)
      await productPage.expectQuantity(3)
    })

    test('decrease button decrements quantity', async ({ productPage }) => {
      await productPage.increaseQuantity(3) // qty = 4
      await productPage.decreaseQuantity(1) // qty = 3
      await productPage.expectQuantity(3)
    })

    test('quantity cannot go below 1 via the decrease button', async ({
      productPage,
    }) => {
      // Already at 1; clicking decrease should not go to 0
      if(!await productPage.quantityDecrease.isDisabled()) {
        await productPage.decreaseQuantity()
      }
      await productPage.expectQuantity(1)
    })

    test('decrease button is disabled when quantity is 1', async ({
      productPage,
    }) => {
      await expect(productPage.quantityDecrease).toBeDisabled()
    })
  })

  test.describe('Add to cart', () => {
    test('adds the correct quantity to the cart @smoke', async ({
      productPage,
      cartPage,
    }) => {
      await productPage.goto(PRODUCTS.keyboard.id)
      await productPage.increaseQuantity(2) // qty = 3
      await productPage.addToCart()

      // Cart badge should show 3
      await productPage.expectCartCount(3)
    })

    test('shows confirmation text after adding to cart', async ({
      productPage,
    }) => {
      await productPage.goto(PRODUCTS.keyboard.id)
      await productPage.addToCart()
      await productPage.expectAddedConfirmation()
    })

    test('cart reflects correct item after adding from detail page', async ({
      productPage,
      cartPage,
    }) => {
      await productPage.goto(PRODUCTS.keyboard.id)
      await productPage.addToCart()

      await cartPage.goto()
      await cartPage.expectItemCount(1)
      await expect(
        cartPage.items.first().getByTestId('cart-item-name'),
      ).toContainText(PRODUCTS.keyboard.name)
    })
  })

  test.describe('Out-of-stock product', () => {
    test('add-to-cart button is disabled for out-of-stock product', async ({
      productPage,
    }) => {
      await productPage.goto(PRODUCTS.outOfStock.id)
      await productPage.expectOutOfStock()
    })

    test('out-of-stock product does not update cart badge when interacted', async ({
      productPage,
    }) => {
      await productPage.goto(PRODUCTS.outOfStock.id)
      // Button is disabled so clicking it should have no effect
      await productPage.addToCartBtn.click({ force: true }).catch(() => {})
      await productPage.expectCartCount(0)
    })
  })
})
