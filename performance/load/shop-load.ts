/**
 * LOAD TEST — shop-load.ts
 *
 * This test hammers your shop's HTTP endpoints directly (no browser).
 * Think of it as simulating many users hitting your server simultaneously.
 *
 * k6 runs this file with virtual users (VUs). Each VU loops through the
 * default export function for the duration of the test.
 *
 * NOW OPTIMIZED FOR API TESTING:
 * - /api/products (list all products)
 * - /api/products?category=X (filtered products)
 * - /api/products/[id] (individual product details)
 *
 * LEARNING GOAL: Understand how your app behaves under concurrent API load.
 */
 
import http from 'k6/http';
import { sleep, check } from 'k6';
 
// Sample product IDs for testing
const productIds = ['mk-001', 'mk-002', 'ms-001', 'ls-001', 'dl-001', 'uh-001', 'wc-001'];
const categories = ['Keyboards', 'Stands', 'Lighting', 'Accessories', 'Audio & Video'];

// ------------------------------------------------------------
// OPTIONS — controls how the test runs
// Read: https://grafana.com/docs/k6/latest/using-k6/k6-options/
// ------------------------------------------------------------
export const options = {
  // Stages ramp VUs up and down over time.
  // This simulates a realistic traffic pattern rather than an instant spike.
  stages: [
    { duration: '30s', target: 10 },  // ramp up to 10 users over 30s
    { duration: '1m',  target: 10 },  // hold at 10 users for 1 minute
    { duration: '20s', target: 0  },  // ramp back down to 0
  ],

  thresholds: {
    'http_req_duration': [],
    'http_req_failed': [],
  },
};
 
// ------------------------------------------------------------
// BASE URL
// Switch this to your deployed URL when testing in CI.
// ------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// ------------------------------------------------------------
// HELPER — pick random item from array
// ------------------------------------------------------------
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ------------------------------------------------------------
// DEFAULT FUNCTION — each VU runs this in a loop
// Tests both SSR pages AND dedicated API endpoints
// ------------------------------------------------------------
export default function () {
  // --- Step 1: Get all products via API ---
  const allProductsRes = http.get(`${BASE_URL}/api/products`);
  
  check(allProductsRes, {
    'GET /api/products status is 200': (response: { status: number }) => response.status === 200,
    'GET /api/products response time is under 500ms': (response: { timings: { duration: number } }) => response.timings.duration < 500,
    'GET /api/products returns products array': (response: { body: string }) => {
      try {
        const body = JSON.parse(response.body);
        return Array.isArray(body.products) && body.products.length > 0;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);

  // --- Step 2: Filter products by category via API ---
  const category = randomItem(categories);
  const filteredRes = http.get(`${BASE_URL}/api/products?category=${encodeURIComponent(category)}`);
  
  check(filteredRes, {
    'GET /api/products?category status is 200': (response: { status: number }) => response.status === 200,
    'GET /api/products?category response time is under 500ms': (response: { timings: { duration: number } }) => response.timings.duration < 500,
  });

  sleep(0.5);

  // --- Step 3: Get individual product details via API ---
  const productId = randomItem(productIds);
  const productDetailRes = http.get(`${BASE_URL}/api/products/${productId}`);

  check(productDetailRes, {
    'GET /api/products/[id] status is 200': (response: { status: number }) => response.status === 200,
    'GET /api/products/[id] response time is under 500ms': (response: { timings: { duration: number } }) => response.timings.duration < 500,
    'GET /api/products/[id] returns product object': (response: { body: string }) => {
      try {
        const body = JSON.parse(response.body);
        return body.id && body.name && body.price;
      } catch {
        return false;
      }
    },
  });

  sleep(0.5);

  // --- Step 4: Visit homepage (SSR) ---
  const homeRes = http.get(`${BASE_URL}/`);
 
  check(homeRes, {
    'homepage status is 200': (response: { status: number }) => response.status === 200, 
    'homepage response time is under 1000ms': (response: { timings: { duration: number } }) => response.timings.duration < 1000,
  });
 
  sleep(1);
 
  // --- Step 5: Visit product detail page (SSR) ---
  const pageRes = http.get(`${BASE_URL}/products/${productId}`);

  check(pageRes, {
    'product page status is 200': (response: { status: number }) => response.status === 200,
    'product page response time is under 1000ms': (response: { timings: { duration: number } }) => response.timings.duration < 1000,
  });

  sleep(1);
}