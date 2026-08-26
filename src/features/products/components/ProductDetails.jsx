import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ProductDescription } from '@/features/products/components/ProductDescription'
import { ProductDetailImage } from '@/features/products/components/ProductDetailImage'
import { ProductOptions } from '@/features/products/components/ProductOptions'
import { PageHeader } from '@/shared/layout/PageHeader'

function getProductName(product) {
  return [product.brand, product.model].filter(Boolean).join(' ') || 'Unnamed product'
}

export function ProductDetails({ cartAction, product }) {
  const productName = getProductName(product)

  return (
    <article>
      <Link
        className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        to="/"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to products
      </Link>
      <PageHeader eyebrow="Product" title={productName} />
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <ProductDetailImage
            imageUrl={product.imageUrl}
            productName={productName}
          />
        </div>
        <div className="space-y-10">
          <ProductDescription product={product} />
          <ProductOptions
            action={cartAction}
            colors={product.colors}
            key={product.id}
            storageOptions={product.storageOptions}
          />
        </div>
      </div>
    </article>
  )
}
