import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getProductMock } = vi.hoisted(() => ({
  getProductMock: vi.fn(),
}))

vi.mock('@/features/products/api/productsApi', () => ({
  productsApi: { getProduct: getProductMock },
}))

import { useProduct } from '@/features/products/hooks/useProduct'

describe('useProduct', () => {
  beforeEach(() => {
    getProductMock.mockReset()
  })

  it('remains idle when no product ID is provided', () => {
    const { result } = renderHook(() => useProduct(undefined))

    expect(result.current).toMatchObject({
      isIdle: true,
      product: null,
      status: 'idle',
    })
    expect(getProductMock).not.toHaveBeenCalled()
  })

  it('loads and exposes a product', async () => {
    const product = { id: '1' }
    getProductMock.mockResolvedValue(product)

    const { result } = renderHook(() => useProduct('1'))

    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.product).toBe(product)
    expect(getProductMock).toHaveBeenCalledWith('1', {
      signal: expect.any(AbortSignal),
    })
  })

  it('reloads when the product ID changes', async () => {
    getProductMock
      .mockResolvedValueOnce({ id: '1' })
      .mockResolvedValueOnce({ id: '2' })

    const { rerender, result } = renderHook(
      ({ productId }) => useProduct(productId),
      { initialProps: { productId: '1' } },
    )

    await waitFor(() => expect(result.current.product?.id).toBe('1'))
    rerender({ productId: '2' })
    await waitFor(() => expect(result.current.product?.id).toBe('2'))

    expect(getProductMock).toHaveBeenCalledTimes(2)
  })

  it('exposes errors and retries the request', async () => {
    const product = { id: '1' }
    getProductMock
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce(product)

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => expect(result.current.isError).toBe(true))
    act(() => result.current.retry())
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.product).toBe(product)
    expect(getProductMock).toHaveBeenCalledTimes(2)
  })

  it('aborts the active request when the product ID changes', async () => {
    const signals = []
    getProductMock.mockImplementation((id, { signal }) => {
      signals.push({ id, signal })
      return new Promise(() => {})
    })

    const { rerender } = renderHook(({ productId }) => useProduct(productId), {
      initialProps: { productId: '1' },
    })

    rerender({ productId: '2' })

    await waitFor(() => expect(signals).toHaveLength(2))
    expect(signals[0]).toMatchObject({ id: '1' })
    expect(signals[0].signal.aborted).toBe(true)
    expect(signals[1].signal.aborted).toBe(false)
  })
})
