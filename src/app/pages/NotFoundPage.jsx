import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm tracking-[0.16em] text-muted-foreground uppercase">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <Link
        className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        to="/"
      >
        Return to products
      </Link>
    </main>
  )
}
