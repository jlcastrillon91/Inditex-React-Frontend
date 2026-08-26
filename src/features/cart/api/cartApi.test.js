import { beforeEach, describe, expect, it, vi } from 'vitest'

const { apiClientMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
}))

vi.mock('@/shared/api/apiClient', () => ({ apiClient: apiClientMock }))

import { cartApi } from '@/features/cart/api/cartApi'

const product = {
  colorCode: 1,
  productId: 'product-123',
  storageCode: 2,
}

describe('cartApi', () => {
  beforeEach(() => {
    apiClientMock.mockReset()
  })

  it('adds a configured product and returns the authoritative count', async () => {
    apiClientMock.mockResolvedValue({ count: 3 })

    await expect(cartApi.addProduct(product)).resolves.toBe(3)
    expect(apiClientMock).toHaveBeenCalledWith('/api/cart', {
      body: {
        colorCode: 1,
        id: 'product-123',
        storageCode: 2,
      },
      method: 'POST',
      signal: undefined,
    })
  })

  it('passes an AbortSignal to the cart request', async () => {
    const controller = new AbortController()
    apiClientMock.mockResolvedValue({ count: 1 })

    await cartApi.addProduct({ ...product, signal: controller.signal })

    expect(apiClientMock).toHaveBeenCalledWith(
      '/api/cart',
      expect.objectContaining({ signal: controller.signal }),
    )
  })

  it('accepts zero-valued option codes', async () => {
    apiClientMock.mockResolvedValue({ count: 0 })

    await expect(
      cartApi.addProduct({ ...product, colorCode: 0, storageCode: 0 }),
    ).resolves.toBe(0)
  })

  it.each([
    [{ colorCode: 1, storageCode: 2 }, 'A product ID is required.'],
    [
      { productId: 'product-123', storageCode: 2 },
      'A color code is required.',
    ],
    [
      { colorCode: 1, productId: 'product-123' },
      'A storage code is required.',
    ],
  ])('rejects incomplete product configuration', async (input, message) => {
    await expect(cartApi.addProduct(input)).rejects.toThrow(
      new TypeError(message),
    )
    expect(apiClientMock).not.toHaveBeenCalled()
  })

  it.each([
    undefined,
    null,
    {},
    { count: -1 },
    { count: 1.5 },
    { count: '1' },
  ])('rejects the malformed cart response %j', async (response) => {
    apiClientMock.mockResolvedValue(response)

    await expect(cartApi.addProduct(product)).rejects.toThrow(
      new TypeError('The cart API returned an invalid count.'),
    )
  })

  it('propagates API failures unchanged', async () => {
    const error = new Error('Cart request failed')
    apiClientMock.mockRejectedValue(error)

    await expect(cartApi.addProduct(product)).rejects.toBe(error)
  })
})
