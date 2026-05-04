# Performance Testing — k6

This folder contains load and browser performance tests for the Playwright Shop,
built with [k6](https://k6.io).

## Folder structure

```
performance/
├── load/
│   └── shop-load.ts       # HTTP load test — tests endpoints directly
├── browser/
│   └── shop-browser.ts    # Browser test — tests real user experience
├── utils/
│   └── thresholds.ts      # Shared pass/fail criteria
└── results/               # Output files (gitignored)
```

---

## Getting started

### 1. Install k6

**Mac:**
```bash
brew install k6
```

**Windows:**
```bash
winget install k6
```

**Linux:**
See the [official docs](https://grafana.com/docs/k6/latest/set-up/install-k6/).

---

### 2. Start your shop locally

k6 needs something to test. In one terminal:

```bash
npm run dev
```

---

### 3. Run a test

In another terminal, from the project root:

```bash
# HTTP load test
k6 run performance/load/shop-load.ts

# Browser test
k6 run performance/browser/shop-browser.ts
```

---

### 4. Read the output

k6 prints a summary after every run. Key things to look at:

```
http_req_duration............: avg=123ms  p(95)=340ms
http_req_failed..............: 0.00%
```

- **avg** — average response time across all requests
- **p(95)** — 95th percentile — the number to care about most
- **http_req_failed** — any non-zero value here needs investigating

If a threshold is breached, k6 prints it in red and exits with code 1.

---

## Implementation checklist

Work through these in order. Each step builds on the last.

### Phase 1 — HTTP load test (`load/shop-load.ts`)
- [ ] Identify all the routes in your shop worth testing
- [ ] Add `http.get()` calls for each route
- [ ] Add `check()` assertions on status codes
- [ ] Add a response time check on at least one request
- [ ] Run the test with no thresholds, note the real p(95) numbers
- [ ] Fill in `thresholds.ts` based on those real numbers
- [ ] Run again — does it pass your own thresholds?

### Phase 2 — Browser test (`browser/shop-browser.ts`)
- [ ] Navigate to the homepage and assert an element is visible
- [ ] Add one meaningful user interaction (e.g. clicking a product)
- [ ] Check that a Core Web Vital threshold fails if you add `sleep(5)` — proves it works
- [ ] Remove the sleep, confirm it passes clean

### Phase 3 — CI (`/.github/workflows/k6-performance.yml`)
- [ ] Add the step to start your Next.js app before the tests run
- [ ] Add `actions/upload-artifact` to save results
- [ ] Trigger the workflow manually — confirm it goes green
- [ ] Confirm a broken threshold causes the workflow to fail (test this!)

### Stretch goals
- [ ] Push results to [Grafana Cloud k6](https://grafana.com/products/cloud/k6/) (free tier) for visual dashboards
- [ ] Add per-URL thresholds for your API routes
- [ ] Add a smoke test stage (1 VU, 30s) that runs on every PR

---

## Concepts worth understanding

| Term | What it means |
|------|--------------|
| Virtual User (VU) | A simulated user running your test script concurrently |
| Stages | Ramp VU count up/down over time to simulate realistic traffic |
| Think time | `sleep()` between requests — real users aren't instant |
| p(95) | 95th percentile response time — your most important metric |
| Threshold | A pass/fail rule — breaching one fails the CI run |
| Core Web Vitals | Google's user experience metrics: LCP, FID, CLS |

---

## Useful links

- [k6 docs](https://grafana.com/docs/k6/latest/)
- [k6 browser module](https://grafana.com/docs/k6/latest/using-k6-browser/)
- [Thresholds reference](https://grafana.com/docs/k6/latest/using-k6/thresholds/)
- [Core Web Vitals explained](https://web.dev/vitals/)