import { renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CartProvider } from '@/features/cart/context/CartProvider'
import { useCart } from '@/features/cart/hooks/useCart'

describe('useCart', () => {
  it('returns the cart context inside its provider', () => {
    const storage = { getCount: () => 2, setCount: vi.fn() }
    const wrapper = ({ children }) =>
      createElement(CartProvider, { storage }, children)
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(result.current.count).toBe(2)
    expect(result.current.setCount).toEqual(expect.any(Function))
  })

  it('fails clearly outside its provider', () => {
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider.',
    )
  })
})
