import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration.
 *
 * BASE_URL can be overridden via environment variable, which enables the same
 * test suite to run locally (against `next dev`), in Docker Compose (against
 * the containerised app), or in CI (against the built production server).
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Run tests in parallel by default */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left `test.only` in the source */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests once on CI */
  retries: process.env.CI ? 2 : 0,

  /* Limit parallelism on CI to avoid resource starvation */
  workers: process.env.CI ? 2 : undefined,

  /* Reporters: always HTML (for local review), plus line/github on CI */
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['html', { open: 'on-failure' }], ['list']],

  /* Global test settings */
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',

    /* Consistent viewport */
    viewport: { width: 1280, height: 720 },
  },

  /* Output directories */
  outputDir: 'test-results',

  /* Test projects — cross-browser by default, easily extended */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Mobile viewports */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  /**
   * webServer: automatically starts (and waits for) the Next.js app before
   * running tests.  Skipped when BASE_URL is set externally (Docker / CI
   * pointing at an already-running server).
   */
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
