import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getProductsMock } = vi.hoisted(() => ({
  getProductsMock: vi.fn(),
}))

vi.mock('@/features/products/api/productsApi', () => ({
  productsApi: { getProducts: getProductsMock },
}))

import { useProducts } from '@/features/products/hooks/useProducts'

describe('useProducts', () => {
  beforeEach(() => {
    getProductsMock.mockReset()
  })

  it('loads and exposes the product list', async () => {
    const products = [{ id: '1' }]
    getProductsMock.mockResolvedValue(products)

    const { result } = renderHook(() => useProducts())

    expect(result.current).toMatchObject({
      error: null,
      isLoading: true,
      products: [],
      status: 'loading',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.products).toBe(products)
    expect(getProductsMock).toHaveBeenCalledOnce()
    expect(getProductsMock.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal)
  })

  it('exposes request failures', async () => {
    const error = new Error('Unable to load products')
    getProductsMock.mockRejectedValue(error)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(error)
    expect(result.current.products).toEqual([])
  })

  it('retries a failed request', async () => {
    const products = [{ id: '2' }]
    getProductsMock
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce(products)

    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.isError).toBe(true))

    act(() => result.current.retry())

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.products).toBe(products)
    expect(getProductsMock).toHaveBeenCalledTimes(2)
  })

  it('aborts the active request when unmounted', () => {
    let requestSignal
    getProductsMock.mockImplementation(({ signal }) => {
      requestSignal = signal
      return new Promise(() => {})
    })

    const { unmount } = renderHook(() => useProducts())

    expect(requestSignal.aborted).toBe(false)
    unmount()
    expect(requestSignal.aborted).toBe(true)
  })
})
