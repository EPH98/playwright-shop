import Link from 'next/link'

/**
 * Custom 404 page — rendered by Next.js App Router whenever notFound() is
 * called or a route simply doesn't exist.
 */
export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center"
      data-testid="not-found-page"
    >
      <p className="font-mono text-xs tracking-widest uppercase text-muted mb-4">404</p>
      <h1 className="font-display text-5xl md:text-6xl font-bold">Page not found</h1>
      <p className="text-muted mt-4 max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary mt-10">
        Back to the shop
      </Link>
    </div>
  )
}
