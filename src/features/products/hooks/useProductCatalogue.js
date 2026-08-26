import { useProductSearch } from '@/features/products/hooks/useProductSearch'
import { usePagination } from '@/shared/hooks/usePagination'

export const PRODUCTS_PER_PAGE = 12

export function useProductCatalogue({ enabled = true, products }) {
  const { filteredProducts, search, setSearch, totalResults } =
    useProductSearch({ products })
  const { currentPage, pageCount, setPage, visibleItems } = usePagination({
    enabled,
    items: filteredProducts,
    pageSize: PRODUCTS_PER_PAGE,
  })

  return {
    currentPage,
    pageCount,
    search,
    setPage,
    setSearch,
    totalResults,
    visibleProducts: visibleItems,
  }
}
