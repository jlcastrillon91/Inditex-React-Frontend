import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function parsePage(value) {
  if (!/^\d+$/.test(value || '')) return 1

  const page = Number(value)
  return Number.isSafeInteger(page) && page > 0 ? page : 1
}

export function usePagination({
  enabled = true,
  items,
  pageParam = 'page',
  pageSize = 10,
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const requestedPage = parsePage(searchParams.get(pageParam))
  const currentPage = Math.min(requestedPage, pageCount)
  const startIndex = (currentPage - 1) * pageSize
  const visibleItems = items.slice(startIndex, startIndex + pageSize)

  function setPage(page) {
    const nextPage = Math.min(Math.max(1, page), pageCount)
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextPage === 1) nextSearchParams.delete(pageParam)
    else nextSearchParams.set(pageParam, String(nextPage))

    setSearchParams(nextSearchParams)
  }

  useEffect(() => {
    if (!enabled) return

    const rawPage = searchParams.get(pageParam)
    const canonicalPage = currentPage === 1 ? null : String(currentPage)

    if (rawPage === canonicalPage) return

    const nextSearchParams = new URLSearchParams(searchParams)
    if (canonicalPage) nextSearchParams.set(pageParam, canonicalPage)
    else nextSearchParams.delete(pageParam)

    setSearchParams(nextSearchParams, { replace: true })
  }, [currentPage, enabled, pageParam, searchParams, setSearchParams])

  return { currentPage, pageCount, setPage, visibleItems }
}
