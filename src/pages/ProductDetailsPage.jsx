import { useParams } from 'react-router-dom'

import { useProduct } from '@/features/products/hooks/useProduct'
import { Container } from '@/shared/layout/Container'
import { PageHeader } from '@/shared/layout/PageHeader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'
import { Skeleton } from '@/shared/ui/Skeleton'

function getProductName(product) {
  return [product.brand, product.model].filter(Boolean).join(' ') || 'Unnamed product'
}

export function ProductDetailsPage() {
  const { productId } = useParams()
  const { error, isError, isLoading, isSuccess, product, retry } =
    useProduct(productId)

  return (
    <Container as="main" className="py-10 sm:py-14">
      {isLoading ? (
        <section aria-label="Loading product" role="status">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-4 h-12 w-full max-w-lg" />
        </section>
      ) : null}

      {isError && error?.status === 404 ? (
        <EmptyState
          description="The requested product does not exist or is no longer available."
          title="Product not found"
        />
      ) : null}

      {isError && error?.status !== 404 ? (
        <ErrorMessage
          message={error?.message || 'We could not load this product.'}
          onRetry={retry}
        />
      ) : null}

      {isSuccess && !product ? (
        <EmptyState
          description="The requested product is not available."
          title="Product not found"
        />
      ) : null}

      {isSuccess && product ? (
        <PageHeader eyebrow="Product" title={getProductName(product)} />
      ) : null}
    </Container>
  )
}
