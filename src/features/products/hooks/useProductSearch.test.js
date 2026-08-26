import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { useProductSearch } from '@/features/products/hooks/useProductSearch'

const products = [
  { brand: 'Acer', id: '1', model: 'Liquid Jade' },
  { brand: 'Samsung', id: '2', model: 'Galaxy S24' },
  { brand: 'Google', id: '3', model: 'Pixel 9' },
]

function createWrapper(initialEntry = '/') {
  return function Wrapper({ children }) {
    return createElement(MemoryRouter, { initialEntries: [initialEntry] }, children)
  }
}

describe('useProductSearch', () => {
  it('initializes from the URL and matches brand case-insensitively', () => {
    const { result } = renderHook(() => useProductSearch({ products }), {
      wrapper: createWrapper('/?search=aCeR'),
    })

    expect(result.current.search).toBe('aCeR')
    expect(result.current.filteredProducts.map(({ id }) => id)).toEqual(['1'])
  })

  it('matches partial model names', () => {
    const { result } = renderHook(() => useProductSearch({ products }), {
      wrapper: createWrapper('/?search=laxy'),
    })

    expect(result.current.filteredProducts.map(({ id }) => id)).toEqual(['2'])
  })

  it('updates search and resets pagination', () => {
    const { result } = renderHook(
      () => ({
        location: useLocation(),
        search: useProductSearch({ products }),
      }),
      { wrapper: createWrapper('/?page=3') },
    )

    act(() => result.current.search.setSearch('Pixel'))

    expect(result.current.location.search).toBe('?search=Pixel')
    expect(result.current.search.totalResults).toBe(1)
  })

  it('clears the search parameter', () => {
    const { result } = renderHook(
      () => ({
        location: useLocation(),
        search: useProductSearch({ products }),
      }),
      { wrapper: createWrapper('/?search=Acer') },
    )

    act(() => result.current.search.setSearch(''))

    expect(result.current.location.search).toBe('')
    expect(result.current.search.totalResults).toBe(3)
  })
})
