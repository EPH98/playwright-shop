# The Workspace — Playwright Testing Ecosystem

A purpose-built dummy e-commerce frontend paired with a production-grade
Playwright test suite. The goal is a realistic practice environment covering
fixtures, Page Object Models, CI/CD, and Docker — built to be extended as
your skills grow.

---

## Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript | Industry standard; SSR and CSR patterns to test |
| Styling | Tailwind CSS | Utility-first; fast iteration |
| State | Zustand | Lightweight global cart state |
| Testing | Playwright | Cross-browser, first-class TypeScript, fixture API |
| CI | GitHub Actions | Free for public repos; native YAML; artefact uploads |
| Containers | Docker + Compose | Reproducible local + CI environments |

---

## Project layout

```
playwright-shop/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Shop listing (/)
│   │   ├── cart/page.tsx     # Cart (/cart)
│   │   ├── products/[id]/    # Product detail (/products/:id)
│   │   └── not-found.tsx     # 404 page
│   ├── components/           # Reusable React components
│   ├── data/products.ts      # Static product catalogue (the "database")
│   ├── store/cart.ts         # Zustand cart store
│   └── types/index.ts        # Shared TypeScript types
│
├── tests/
│   ├── fixtures/
│   │   ├── index.ts          # ← Custom test() with injected page objects
│   │   └── pages/
│   │       ├── BasePage.ts   # Shared header/nav helpers
│   │       ├── ShopPage.ts   # Shop listing page object
│   │       ├── ProductPage.ts# Product detail page object
│   │       └── CartPage.ts   # Cart page object
│   ├── helpers/
│   │   └── test-data.ts      # Centralised test constants
│   └── e2e/
│       ├── navigation.spec.ts # @smoke — critical navigation paths
│       ├── shop.spec.ts       # @regression — search, filter, sort
│       ├── product.spec.ts    # @regression — detail page, quantity, OOS
│       └── cart.spec.ts       # @regression — add, update, remove, totals
│
├── playwright.config.ts       # Cross-browser config, CI vs local behaviour
├── Dockerfile                 # Multi-stage production image
├── docker-compose.yml         # Run the app in Docker
├── docker-compose.test.yml    # Run Playwright against the Docker app
└── .github/workflows/
    └── playwright.yml         # CI: on push/PR + daily schedule
```

---

## Quick start

### Prerequisites

- Node.js 20+
- npm 9+
- Docker Desktop (optional — for container runs)

### 1. Install dependencies

```bash
npm install
npx playwright install --with-deps
```

### 2. Run the app locally

```bash
npm run dev
# → http://localhost:3000
```

### 3. Run all tests (auto-starts the app)

```bash
npm test
```

Playwright's `webServer` config builds and starts the Next.js app automatically
before tests run. You don't need to have `npm run dev` running separately.

### 4. Run specific test tags

```bash
# Smoke tests only — fast, ~30 seconds
npm run test:smoke

# Full regression suite
npm run test:regression
```

### 5. Interactive UI mode

```bash
npm run test:ui
```

Opens Playwright's browser-based test runner — great for debugging failing
tests step-by-step with a timeline viewer.

### 6. View the HTML report

```bash
npm run test:report
```

---

## Key concepts explained

### Page Object Model (POM)

A design pattern where each page of the application is represented by a class.
The class owns all the locators and interaction methods for that page.

**Why?** Without POMs, every test file repeats the same `page.locator(...)` calls.
When the UI changes (and it will), you fix the locator in one place — the page
object — rather than hunting through every spec file.

```
tests/fixtures/pages/
  BasePage.ts   ← shared across all pages (header, cart icon)
  ShopPage.ts   ← extends BasePage; owns search, filter, product grid
  ProductPage.ts← extends BasePage; owns quantity selector, add-to-cart
  CartPage.ts   ← extends BasePage; owns cart items, totals, remove
```

### Fixtures

Playwright's fixture system (an extension of the classic test-setup idea) lets
you declare objects that are automatically created and injected into each test.

```typescript
// tests/fixtures/index.ts
export const test = base.extend<PageFixtures>({
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page))       // created fresh for every test
  },
})

// tests/e2e/shop.spec.ts
test('shows all products', async ({ shopPage }) => {
  //                                    ^ injected automatically — no beforeEach needed
  await shopPage.goto()
  await shopPage.expectProductCount(12)
})
```

This is the key import: `import { test, expect } from '../fixtures'`
— NOT from `@playwright/test`. That single change gives you all three page
objects in every spec.

### data-testid attributes

Every interactive or asserted element in the app has a `data-testid` attribute:

```tsx
<button data-testid="add-to-cart-btn">Add to Cart</button>
```

Tests use `getByTestId()` to find them:

```typescript
await page.getByTestId('add-to-cart-btn').click()
```

**Why not CSS classes or text?** Classes change during styling; text changes
during copy revisions. `data-testid` is a stable, test-only contract between
the app and the test suite. CI breaks when they're removed — which is the
desired behaviour.

### Test tags (@smoke / @regression)

Tests are tagged by appending to the `test.describe` name:

```typescript
test.describe('Navigation @smoke', () => { ... })
test.describe('Cart @regression', () => { ... })
```

Run subsets with `--grep`:

```bash
npx playwright test --grep @smoke       # fast gate, ~30 seconds
npx playwright test --grep @regression  # full suite
```

The GitHub Actions workflow uses this to run a fast smoke gate on PRs
(via the `smoke` job) before the full cross-browser matrix completes.

### Centralised test data

All product IDs, expected counts, and magic strings live in one file:

```typescript
// tests/helpers/test-data.ts
export const PRODUCTS = {
  keyboard: { id: 'mk-001', name: 'Architect 65...', price: '£159.00', ... },
}
export const TOTAL_PRODUCT_COUNT = 12
```

**Why?** If you add a product to `src/data/products.ts`, you update the count
in one place (`test-data.ts`), not inside every spec that asserts on product
counts.

---

## Docker workflows

### Run the app in Docker (production mode)

```bash
docker compose up --build
# → http://localhost:3000
```

### Run Playwright against the Docker app

```bash
# 1. Build and start the app
docker compose up -d --build

# 2. Run tests pointing at the container
BASE_URL=http://localhost:3000 npx playwright test
```

### Full Docker-only run (app + tests)

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml up \
  --abort-on-container-exit --exit-code-from playwright
```

The Playwright container waits for the app's healthcheck to pass before
starting. This is the same pattern used in CI pipelines.

---

## CI/CD — GitHub Actions

The workflow at `.github/workflows/playwright.yml` runs on:

| Event | Jobs |
|---|---|
| Push to `main` or `develop` | Full matrix (Chromium + Firefox + WebKit) |
| Pull Request to `main` | Smoke gate (fast) + full matrix |
| Daily at 02:00 UTC | Full matrix (catches dependency drift) |
| Manual dispatch | Configurable browser + optional grep tag |

### Artefacts

After every run, the HTML report is uploaded as a GitHub Actions artefact
and kept for 14 days. On failure, traces, screenshots, and videos are also
uploaded (kept 7 days). Access them from the **Actions** tab → your run →
**Artefacts**.

### Extending the schedule

To add a second daily run (e.g. 08:00 UTC weekdays):

```yaml
schedule:
  - cron: '0 2 * * *'    # existing — 02:00 UTC daily
  - cron: '0 8 * * 1-5'  # new — 08:00 UTC Mon–Fri
```

---

## Extending the suite

### Add a new page object

1. Create `tests/fixtures/pages/CheckoutPage.ts` extending `BasePage`
2. Add it to the fixtures type in `tests/fixtures/index.ts`
3. Use `{ checkoutPage }` in any spec

### Add a new spec

Create `tests/e2e/checkout.spec.ts`:

```typescript
import { test, expect } from '../fixtures'

test.describe('Checkout @regression', () => {
  test('...', async ({ cartPage, checkoutPage }) => {
    // ...
  })
})
```

### Add a new product

Edit `src/data/products.ts` and update `TOTAL_PRODUCT_COUNT` and
`CATEGORY_COUNTS` in `tests/helpers/test-data.ts`.

---

## npm scripts reference

| Script | Purpose |
|---|---|
| `npm run dev` | Start Next.js in dev mode |
| `npm run build` | Production build |
| `npm test` | Run all Playwright tests (builds app first) |
| `npm run test:ui` | Playwright interactive UI |
| `npm run test:smoke` | `@smoke` tagged tests only |
| `npm run test:regression` | `@regression` tagged tests only |
| `npm run test:headed` | Run tests with browser visible |
| `npm run test:debug` | Run in Playwright debug mode (step-through) |
| `npm run test:report` | Open last HTML report |
