import { act, renderHook, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { addProductMock } = vi.hoisted(() => ({
  addProductMock: vi.fn(),
}))

vi.mock('@/features/cart/api/cartApi', () => ({
  cartApi: { addProduct: addProductMock },
}))

import { CartProvider } from '@/features/cart/context/CartProvider'
import { useAddProduct } from '@/features/cart/hooks/useAddProduct'
import { useCart } from '@/features/cart/hooks/useCart'

const configuration = {
  colorCode: 1,
  productId: 'product-123',
  storageCode: 2,
}

function createWrapper(storage) {
  return function Wrapper({ children }) {
    return createElement(CartProvider, { storage }, children)
  }
}

describe('useAddProduct', () => {
  let storage

  beforeEach(() => {
    addProductMock.mockReset()
    storage = { getCount: () => 0, setCount: vi.fn() }
  })

  it('updates the cart with the authoritative API count', async () => {
    addProductMock.mockResolvedValue(5)
    const { result } = renderHook(
      () => ({ cart: useCart(), mutation: useAddProduct() }),
      { wrapper: createWrapper(storage) },
    )

    await act(() => result.current.mutation.addProduct(configuration))

    expect(addProductMock).toHaveBeenCalledWith(configuration, {
      signal: expect.any(AbortSignal),
    })
    expect(result.current.cart.count).toBe(5)
    expect(result.current.mutation.isSuccess).toBe(true)
  })

  it('returns the active request instead of submitting concurrently', async () => {
    let resolveRequest
    addProductMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      }),
    )
    const { result } = renderHook(() => useAddProduct(), {
      wrapper: createWrapper(storage),
    })

    let firstRequest
    let secondRequest
    act(() => {
      firstRequest = result.current.addProduct(configuration)
      secondRequest = result.current.addProduct(configuration)
    })

    expect(firstRequest).toBe(secondRequest)
    expect(addProductMock).toHaveBeenCalledOnce()
    expect(result.current.isPending).toBe(true)

    await act(async () => resolveRequest(1))
  })

  it('exposes API failures without changing the count', async () => {
    const error = new Error('Unable to add product')
    addProductMock.mockRejectedValue(error)
    const { result } = renderHook(
      () => ({ cart: useCart(), mutation: useAddProduct() }),
      { wrapper: createWrapper(storage) },
    )

    await act(async () => {
      await expect(
        result.current.mutation.addProduct(configuration),
      ).rejects.toBe(error)
    })

    expect(result.current.cart.count).toBe(0)
    expect(result.current.mutation).toMatchObject({
      error,
      isError: true,
    })
  })

  it('encapsulates explicit request cancellation', async () => {
    addProductMock.mockImplementation((_, { signal }) =>
      new Promise((_, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Cancelled', 'AbortError'))
        })
      }),
    )
    const { result } = renderHook(() => useAddProduct(), {
      wrapper: createWrapper(storage),
    })

    let request
    act(() => {
      request = result.current.addProduct(configuration)
    })
    act(() => result.current.cancel())

    await expect(request).rejects.toMatchObject({ name: 'AbortError' })
    await waitFor(() => expect(result.current.isIdle).toBe(true))
  })
})
