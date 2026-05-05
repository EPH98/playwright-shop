/**
 * BROWSER TEST — shop-browser.ts
 *
 * This test uses a real Chromium browser (via k6's browser module),
 * which means it measures what a real user actually experiences:
 * page render time, interaction delays, Core Web Vitals.
 *
 * The API looks very similar to Playwright — intentionally so.
 * If you can write Playwright, you can write this.
 *
 * LEARNING GOAL: Measure real user experience metrics under load.
 *
 * Docs: https://grafana.com/docs/k6/latest/using-k6-browser/
 */
import { check, sleep } from 'k6';

// ------------------------------------------------------------
// OPTIONS
// Browser tests are expensive — keep VU counts LOW compared
// to your HTTP load test. Even 3-5 concurrent browsers is meaningful.
// ------------------------------------------------------------
export const options = {
  scenarios: {
    browser_test: {
      executor: 'constant-vus',
      vus: 2,           // 2 concurrent browser sessions
      duration: '1m',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    'http_req_duration': ['p(90) < 2000'],
    'http_req_failed': [],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ------------------------------------------------------------
// DEFAULT FUNCTION
// Each VU opens a browser, runs your scenario, then closes it.
// ------------------------------------------------------------
export default async function ({ browser }: { browser: any }) {
  console.log(JSON.stringify(Object.keys(browser)));
  const page = await(browser as any).newPage();

  try {
    // --- Step 1: Navigate to homepage ---
    await page.goto(`${BASE_URL}/`);

    // waitForLoadState ensures the page is fully loaded before you interact.
    // 'networkidle' means no network requests for 500ms — page is stable.
    await page.waitForLoadState('networkidle');

    // TODO: Add a check that an element you expect on the homepage is visible.
    // Hint: Use page.locator() just like Playwright.
    // e.g. check(await page.locator('h1').isVisible(), { 'homepage h1 visible': v => v })

    check(await page.locator('h1').isVisible(), {
      'homepage h1 visible': v => v,
    });

    // --- Step 2: Click a product, add to cart, go to cart page ---
    await page.locator('[data-product-id="mk-001"]').click();
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="add-to-cart-detail"]').click();
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="cart-icon"]').click();
    await page.waitForLoadState('networkidle');

    sleep(1);

  } finally {
    // Always close the page — if you don't, you'll leak browser processes.
    await page.close();
  }
}