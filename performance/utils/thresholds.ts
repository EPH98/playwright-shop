/**
 * THRESHOLDS — thresholds.ts
 *
 * Thresholds are your performance budget — the line between pass and fail.
 * If any threshold is breached, k6 exits with a non-zero code,
 * which means your CI pipeline will fail the run. Exactly what you want.
 *
 * These are shared across tests so you define your standards in one place.
 *
 * KEY METRICS TO KNOW:
 *
 *   http_req_duration  — total time for a request (most important)
 *   http_req_failed    — % of requests that errored
 *   http_reqs          — total request count (useful for throughput checks)
 *
 * PERCENTILE NOTATION:
 *   p(95) < 500  means: 95% of requests must complete in under 500ms
 *   p(99) < 1000 means: 99% of requests must complete in under 1000ms
 *   The remaining % are your "long tail" — you're allowing some slow outliers.
 *
 * LEARNING GOAL: Define what "good enough" looks like for your app,
 * then let k6 enforce it automatically.
 *
 * Docs: https://grafana.com/docs/k6/latest/using-k6/thresholds/
 */

export const thresholds = {
  // TODO: Fill in sensible values for each metric.
  //
  // Start generous (e.g. p(95) < 2000) and tighten as you understand
  // your app's baseline. Running the test once with no thresholds first
  // will show you real numbers to work from.

  http_req_duration: [
    'p(95) < 500',   // 95% of requests must complete in under 500ms
  ],

  http_req_failed: [
    'p(98) < 0.01',  // 98% of requests must succeed (less than 1% fail)
  ],

  // STRETCH GOAL:
  // You can define thresholds per URL using tagged metrics.
  // e.g. 'http_req_duration{url:http://localhost:3000/api/products}': ['p(95)<200']
  // This lets you set tighter budgets for API routes vs page routes.
};