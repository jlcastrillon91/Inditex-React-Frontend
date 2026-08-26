import { ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { AppLogo } from '@/app/layouts/AppLogo'
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
    <header className="sticky top-0 z-40 border-b bg-background/90 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-6">
          <Link
            aria-label="ITX Mobile home"
            className="rounded-sm transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            to="/"
          >
            <AppLogo />
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
        <div className="border-t border-border/70 py-2.5">
          <Breadcrumbs items={getBreadcrumbItems(pathname)} />
        </div>
      </div>
    </header>
  )
}
