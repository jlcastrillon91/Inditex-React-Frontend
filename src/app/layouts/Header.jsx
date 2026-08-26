import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useCart } from '@/features/cart'

export function Header() {
  const { count } = useCart()

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
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
    </header>
  )
}
