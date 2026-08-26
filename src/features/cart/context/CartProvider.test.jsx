import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CartProvider } from '@/features/cart/context/CartProvider'
import { useCart } from '@/features/cart/hooks/useCart'

function CartConsumer() {
  const { count, setCount } = useCart()

  return (
    <>
      <output aria-label="Cart count">{count}</output>
      <button onClick={() => setCount(7)} type="button">
        Set count
      </button>
    </>
  )
}

describe('CartProvider', () => {
  it('initializes from storage and persists authoritative updates', async () => {
    const storage = {
      getCount: vi.fn().mockReturnValue(3),
      setCount: vi.fn().mockReturnValue(true),
    }
    render(
      <CartProvider storage={storage}>
        <CartConsumer />
      </CartProvider>,
    )

    expect(screen.getByRole('status', { name: 'Cart count' })).toHaveTextContent(
      '3',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set count' }))

    expect(screen.getByRole('status', { name: 'Cart count' })).toHaveTextContent(
      '7',
    )
    await waitFor(() => expect(storage.setCount).toHaveBeenLastCalledWith(7))
  })

  it('rejects invalid count updates', () => {
    const storage = { getCount: () => 0, setCount: vi.fn() }
    const wrapper = ({ children }) => (
      <CartProvider storage={storage}>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })

    expect(() => act(() => result.current.setCount(-1))).toThrow(
      'Cart count must be a non-negative integer.',
    )
  })
})
