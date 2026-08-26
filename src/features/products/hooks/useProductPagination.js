import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const PRODUCTS_PER_PAGE = 12

function parsePage(value) {
  if (!/^\d+$/.test(value || '')) return 1

  const page = Number(value)
  return Number.isSafeInteger(page) && page > 0 ? page : 1
}

export function useProductPagination(
  products,
  { enabled = true, pageSize = PRODUCTS_PER_PAGE } = {},
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize))
  const requestedPage = parsePage(searchParams.get('page'))
  const currentPage = Math.min(requestedPage, pageCount)
  const startIndex = (currentPage - 1) * pageSize
  const visibleProducts = products.slice(startIndex, startIndex + pageSize)

  function setPage(page) {
    const nextPage = Math.min(Math.max(1, page), pageCount)
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextPage === 1) nextSearchParams.delete('page')
    else nextSearchParams.set('page', String(nextPage))

    setSearchParams(nextSearchParams)
  }

  useEffect(() => {
    if (!enabled) return

    const rawPage = searchParams.get('page')
    const canonicalPage = currentPage === 1 ? null : String(currentPage)

    if (rawPage === canonicalPage) return

    const nextSearchParams = new URLSearchParams(searchParams)
    if (canonicalPage) nextSearchParams.set('page', canonicalPage)
    else nextSearchParams.delete('page')

    setSearchParams(nextSearchParams, { replace: true })
  }, [currentPage, enabled, searchParams, setSearchParams])

  return { currentPage, pageCount, setPage, visibleProducts }
}
