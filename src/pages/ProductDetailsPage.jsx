import { useParams } from 'react-router-dom'

import { useAddProduct } from '@/features/cart'
import { ProductDetails } from '@/features/products/components/ProductDetails'
import { useProduct } from '@/features/products/hooks/useProduct'
import { Container } from '@/shared/layout/Container'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'
import { Skeleton } from '@/shared/ui/Skeleton'

export function ProductDetailsPage() {
  const { productId } = useParams()
  const cartMutation = useAddProduct()
  const { error, isError, isLoading, isSuccess, product, retry } =
    useProduct(productId)

  return (
    <Container as="main" className="py-10 sm:py-14">
      {isLoading ? (
        <section aria-label="Loading product" role="status">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-4 h-12 w-full max-w-lg" />
          <Skeleton className="mt-18 aspect-square w-full rounded-lg lg:w-1/2" />
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
        <ProductDetails
          cartAction={{
            error: cartMutation.error,
            isPending: cartMutation.isPending,
            isSuccess: cartMutation.isSuccess,
            onSubmit: ({ colorCode, storageCode }) =>
              cartMutation.addProduct({
                colorCode,
                productId: product.id,
                storageCode,
              }),
            reset: cartMutation.reset,
          }}
          key={product.id}
          product={product}
        />
      ) : null}
    </Container>
  )
}
