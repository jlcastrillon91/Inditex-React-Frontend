import { ProductGrid } from '@/features/products/components/ProductGrid'
import { ProductGridSkeleton } from '@/features/products/components/ProductGridSkeleton'
import { useProductPagination } from '@/features/products/hooks/useProductPagination'
import { useProducts } from '@/features/products/hooks/useProducts'
import { Container } from '@/shared/layout/Container'
import { PageHeader } from '@/shared/layout/PageHeader'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'
import { Pagination } from '@/shared/ui/Pagination'

function getCatalogueDescription({ isLoading, products }) {
  if (isLoading) return 'Loading the latest devices…'

  const label = products.length === 1 ? 'device' : 'devices'
  return `${products.length} ${label} available`
}

export function ProductListPage() {
  const { error, isError, isLoading, products, retry } = useProducts()
  const { currentPage, pageCount, setPage, visibleProducts } =
    useProductPagination(products, { enabled: !isLoading && !isError })

  return (
    <Container as="main" className="py-10 sm:py-14">
      <PageHeader
        description={getCatalogueDescription({ isLoading, products })}
        eyebrow="Catalogue"
        title="Mobile devices"
      />

      <section aria-label="Products" className="mt-10 sm:mt-12">
        {isLoading ? <ProductGridSkeleton /> : null}

        {isError ? (
          <ErrorMessage
            message={
              error?.message ||
              'We could not load the catalogue. Please try again.'
            }
            onRetry={retry}
          />
        ) : null}

        {!isLoading && !isError && products.length === 0 ? (
          <EmptyState
            description="Please check again soon."
            title="No devices are available"
          />
        ) : null}

        {!isLoading && !isError && products.length > 0 ? (
          <>
            <ProductGrid products={visibleProducts} />
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                onPageChange={setPage}
                pageCount={pageCount}
              />
            </div>
          </>
        ) : null}
      </section>
    </Container>
  )
}
