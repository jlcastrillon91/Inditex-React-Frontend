import { Link } from 'react-router-dom'

import { ProductImage } from '@/features/products/components/ProductImage'
import { ProductPrice } from '@/features/products/components/ProductPrice'

export function ProductCard({ product }) {
  const productName = [product.brand, product.model].filter(Boolean).join(' ')

  return (
    <article className="product-card group h-full">
      <Link
        aria-label={`View ${productName || 'product'} details`}
        className="block h-full rounded-xl border border-border/80 bg-card p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_14px_32px_rgba(35,20,18,0.09)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transform-none motion-reduce:transition-none"
        to={`/product/${encodeURIComponent(product.id)}`}
      >
        <div className="aspect-square overflow-hidden rounded-lg bg-muted/70">
          <ProductImage imageUrl={product.imageUrl} productName={productName} />
        </div>
        <div className="px-1 pt-4 pb-1">
          <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            {product.brand || 'Unknown brand'}
          </p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h2 className="font-medium tracking-tight text-foreground group-hover:underline group-hover:underline-offset-4">
              {product.model || 'Unknown model'}
            </h2>
            <ProductPrice compact value={product.price} />
          </div>
        </div>
      </Link>
    </article>
  )
}
