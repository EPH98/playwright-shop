import { test, expect } from '../fixtures'

/**
 * Navigation tests — @smoke
 *
 * These are the fastest, highest-value tests.  They confirm the critical
 * navigational skeleton of the app works end-to-end.  Tag: @smoke so they
 * can be run in isolation with `npm run test:smoke`.
 */

test.describe('Navigation @smoke', () => {
  test('homepage loads with correct title', async ({ shopPage }) => {
    await shopPage.goto()
    const title = await shopPage.getTitle()
    expect(title).toContain('The Workspace')
  })

  test('header is visible and contains logo and cart icon', async ({ shopPage }) => {
    await shopPage.goto()
    await expect(shopPage.header).toBeVisible()
    await expect(shopPage.logo).toBeVisible()
    await expect(shopPage.cartIcon).toBeVisible()
  })

  test('clicking the logo from any page returns to the homepage', async ({
    shopPage,
    productPage,
  }) => {
    await productPage.goto('mk-001')
    await shopPage.clickLogo()
    expect(shopPage.page.url()).toContain('localhost')
    // URL should be the root, not a product page
    expect(shopPage.page.url()).not.toContain('/products/')
  })

  test('cart icon navigates to /cart', async ({ shopPage }) => {
    await shopPage.goto()
    await shopPage.openCart()
    await expect(shopPage.page).toHaveURL(/\/cart/)
  })

  test('cart badge is hidden when cart is empty', async ({ shopPage }) => {
    await shopPage.goto()
    await shopPage.expectCartCount(0)
  })

  test('product card links navigate to the correct product detail page', async ({
    shopPage,
  }) => {
    await shopPage.goto()
    const firstCard = shopPage.productCardAt(0)
    const productName = await firstCard.getByTestId('product-name').textContent()
    await firstCard.click()
    // Should be on a product detail page
    await expect(shopPage.page).toHaveURL(/\/products\//)
    // The product name on the detail page should match the card
    await expect(shopPage.page.getByTestId('product-detail-name')).toContainText(
      productName ?? '',
    )
  })

  test('continue shopping link on cart page returns to homepage', async ({
    cartPage,
  }) => {
    await cartPage.goto()
    await cartPage.continueShopping.click()
    await expect(cartPage.page).toHaveURL(/\/$|\/\?/)
  })

  test('breadcrumb on product page contains working links', async ({
    productPage,
  }) => {
    await productPage.goto('mk-001')
    const breadcrumb = productPage.page.locator('[data-testid="product-breadcrumb"]')
    await expect(breadcrumb).toBeVisible()

    // "Shop" link returns to listing
    await breadcrumb.getByText('Shop').click()
    await expect(productPage.page).toHaveURL(/\/$|\/\?/)
  })
})
