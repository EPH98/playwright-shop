import { Suspense } from 'react'
import { ShopContent } from './ShopContent'

/**
 * Page entry point.
 *
 * Next.js 14 App Router requires that any component using useSearchParams()
 * be wrapped in a <Suspense> boundary at the page level.  We keep page.tsx
 * as a thin wrapper and put all the real UI in ShopContent.tsx.
 *
 * CS concept — Separation of concerns: each file has one job.  page.tsx
 * handles the rendering boundary; ShopContent.tsx handles the shop logic.
 */
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="text-muted font-mono text-sm animate-pulse">Loading…</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
