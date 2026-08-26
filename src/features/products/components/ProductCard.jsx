import { Link } from 'react-router-dom'

import { ProductImage } from '@/features/products/components/ProductImage'

const priceFormatter = new Intl.NumberFormat('en-IE', {
  currency: 'EUR',
  maximumFractionDigits: 2,
  style: 'currency',
})

function formatPrice(price) {
  return price === null ? 'Price unavailable' : priceFormatter.format(price)
}

export function ProductCard({ product }) {
  const productName = [product.brand, product.model].filter(Boolean).join(' ')

  return (
    <article className="group h-full">
      <Link
        aria-label={`View ${productName || 'product'} details`}
        className="block h-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        to={`/product/${encodeURIComponent(product.id)}`}
      >
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <ProductImage imageUrl={product.imageUrl} productName={productName} />
        </div>
        <div className="pt-4">
          <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {product.brand || 'Unknown brand'}
          </p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h2 className="font-medium tracking-tight text-foreground group-hover:underline group-hover:underline-offset-4">
              {product.model || 'Unknown model'}
            </h2>
            <p className="shrink-0 text-sm font-semibold tabular-nums">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
