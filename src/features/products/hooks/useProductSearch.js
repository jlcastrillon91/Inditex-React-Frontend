import { useSearchParams } from 'react-router-dom'

function matchesSearch(product, normalizedSearch) {
  if (!normalizedSearch) return true

  return [product.brand, product.model]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(normalizedSearch))
}

export function useProductSearch({ products, searchParam = 'search' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get(searchParam) || ''
  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = products.filter((product) =>
    matchesSearch(product, normalizedSearch),
  )

  function setSearch(value) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (value.trim()) nextSearchParams.set(searchParam, value)
    else nextSearchParams.delete(searchParam)

    nextSearchParams.delete('page')
    setSearchParams(nextSearchParams, { replace: true })
  }

  return {
    filteredProducts,
    search,
    setSearch,
    totalResults: filteredProducts.length,
  }
}
