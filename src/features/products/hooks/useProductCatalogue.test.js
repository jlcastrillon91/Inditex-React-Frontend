import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { useProductCatalogue } from '@/features/products/hooks/useProductCatalogue'

const products = Array.from({ length: 15 }, (_, index) => ({
  brand: index < 13 ? 'Acer' : 'Samsung',
  id: String(index + 1),
  model: `Phone ${index + 1}`,
}))

function Wrapper({ children }) {
  return createElement(
    MemoryRouter,
    { initialEntries: ['/?search=Acer&page=2'] },
    children,
  )
}

describe('useProductCatalogue', () => {
  it('paginates the filtered products', () => {
    const { result } = renderHook(
      () => ({
        catalogue: useProductCatalogue({ products }),
        location: useLocation(),
      }),
      { wrapper: Wrapper },
    )

    expect(result.current.catalogue.totalResults).toBe(13)
    expect(result.current.catalogue.currentPage).toBe(2)
    expect(result.current.catalogue.visibleProducts).toHaveLength(1)
    expect(result.current.catalogue.visibleProducts[0].id).toBe('13')

    act(() => result.current.catalogue.setSearch('Samsung'))

    expect(result.current.location.search).toBe('?search=Samsung')
    expect(result.current.catalogue.currentPage).toBe(1)
    expect(result.current.catalogue.visibleProducts).toHaveLength(2)
  })
})
