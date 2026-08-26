import { act, renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import {
  PRODUCTS_PER_PAGE,
  useProductPagination,
} from '@/features/products/hooks/useProductPagination'

const products = Array.from({ length: 25 }, (_, index) => ({
  id: String(index + 1),
}))

function createWrapper(initialEntry = '/') {
  return function Wrapper({ children }) {
    return createElement(MemoryRouter, { initialEntries: [initialEntry] }, children)
  }
}

describe('useProductPagination', () => {
  it('returns the requested page of products', () => {
    const { result } = renderHook(
      () => ({
        location: useLocation(),
        pagination: useProductPagination(products),
      }),
      { wrapper: createWrapper('/?page=2') },
    )

    expect(result.current.pagination.currentPage).toBe(2)
    expect(result.current.pagination.pageCount).toBe(3)
    expect(result.current.pagination.visibleProducts).toHaveLength(
      PRODUCTS_PER_PAGE,
    )
    expect(result.current.pagination.visibleProducts[0].id).toBe('13')
  })

  it('updates the URL while preserving other query parameters', () => {
    const { result } = renderHook(
      () => ({
        location: useLocation(),
        pagination: useProductPagination(products),
      }),
      { wrapper: createWrapper('/?search=acer') },
    )

    act(() => result.current.pagination.setPage(2))

    expect(result.current.location.search).toBe('?search=acer&page=2')
  })

  it('removes page one from the URL', () => {
    const { result } = renderHook(
      () => ({
        location: useLocation(),
        pagination: useProductPagination(products),
      }),
      { wrapper: createWrapper('/?search=acer&page=2') },
    )

    act(() => result.current.pagination.setPage(1))

    expect(result.current.location.search).toBe('?search=acer')
  })

  it('replaces an out-of-range page with the last available page', async () => {
    const { result } = renderHook(
      () => ({
        location: useLocation(),
        pagination: useProductPagination(products),
      }),
      { wrapper: createWrapper('/?page=99') },
    )

    expect(result.current.pagination.currentPage).toBe(3)
    await waitFor(() => expect(result.current.location.search).toBe('?page=3'))
  })
})
