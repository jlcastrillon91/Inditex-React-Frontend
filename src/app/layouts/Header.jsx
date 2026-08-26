import { ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { useCart } from '@/features/cart'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs'

function getBreadcrumbItems(pathname) {
  if (pathname.startsWith('/product/')) {
    return [
      { label: 'Products', to: '/' },
      { label: 'Product details' },
    ]
  }

  if (pathname === '/') return [{ label: 'Products' }]

  return [
    { label: 'Products', to: '/' },
    { label: 'Page not found' },
  ]
}

export function Header() {
  const { count } = useCart()
  const { pathname } = useLocation()

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-6">
          <Link
            className="text-lg font-semibold tracking-[0.18em] uppercase"
            to="/"
          >
            Mobile Store
          </Link>
          <div
            aria-label={`${count} ${count === 1 ? 'item' : 'items'} in cart`}
            aria-live="polite"
            className="flex items-center gap-2 text-sm font-medium"
            role="status"
          >
            <ShoppingBag aria-hidden="true" className="size-4" />
            <span>Cart</span>
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground tabular-nums">
              {count}
            </span>
          </div>
        </div>
        <div className="border-t py-3">
          <Breadcrumbs items={getBreadcrumbItems(pathname)} />
        </div>
      </div>
    </header>
  )
}
