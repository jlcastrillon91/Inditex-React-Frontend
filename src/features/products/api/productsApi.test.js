import { beforeEach, describe, expect, it, vi } from 'vitest'

const { apiClientMock, cacheMock, normalizeProductMock, normalizeProductsMock } =
  vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  cacheMock: { get: vi.fn(), set: vi.fn() },
  normalizeProductMock: vi.fn(),
  normalizeProductsMock: vi.fn(),
  }))

vi.mock('@/shared/api/apiClient', () => ({ apiClient: apiClientMock }))
vi.mock('@/shared/storage/cache', () => ({ cache: cacheMock }))
vi.mock('@/features/products/model/normalizeProduct', () => ({
  normalizeProduct: normalizeProductMock,
  normalizeProducts: normalizeProductsMock,
}))

import { productsApi } from '@/features/products/api/productsApi'

describe('productsApi', () => {
  beforeEach(() => {
    apiClientMock.mockReset()
    cacheMock.get.mockReset().mockReturnValue(null)
    cacheMock.set.mockReset()
    normalizeProductMock.mockReset().mockImplementation((product) => product)
    normalizeProductsMock.mockReset().mockImplementation((products) => products)
  })

  it('returns the cached product list without requesting the API', async () => {
    const products = [{ id: '1' }]
    cacheMock.get.mockReturnValue(products)

    await expect(productsApi.getProducts()).resolves.toBe(products)
    expect(cacheMock.get).toHaveBeenCalledWith('products')
    expect(apiClientMock).not.toHaveBeenCalled()
    expect(cacheMock.set).not.toHaveBeenCalled()
    expect(normalizeProductsMock).not.toHaveBeenCalled()
  })

  it('requests and caches the product list after a cache miss', async () => {
    const products = [{ id: '1' }, { id: '2' }]
    apiClientMock.mockResolvedValue(products)

    await expect(productsApi.getProducts()).resolves.toBe(products)
    expect(apiClientMock).toHaveBeenCalledWith('/api/product', {
      signal: undefined,
    })
    expect(normalizeProductsMock).toHaveBeenCalledWith(products)
    expect(cacheMock.set).toHaveBeenCalledWith('products', products)
  })

  it('passes an AbortSignal to the product-list request', async () => {
    const controller = new AbortController()
    apiClientMock.mockResolvedValue([])

    await productsApi.getProducts({ signal: controller.signal })

    expect(apiClientMock).toHaveBeenCalledWith('/api/product', {
      signal: controller.signal,
    })
  })

  it('returns a cached product without requesting the API', async () => {
    const product = { id: 'phone 1' }
    cacheMock.get.mockReturnValue(product)

    await expect(productsApi.getProduct('phone 1')).resolves.toBe(product)
    expect(cacheMock.get).toHaveBeenCalledWith('product:phone 1')
    expect(apiClientMock).not.toHaveBeenCalled()
    expect(normalizeProductMock).not.toHaveBeenCalled()
  })

  it('encodes the product ID and caches a requested product', async () => {
    const product = { id: 'phone/1' }
    apiClientMock.mockResolvedValue(product)

    await expect(productsApi.getProduct('phone/1')).resolves.toBe(product)
    expect(apiClientMock).toHaveBeenCalledWith('/api/product/phone%2F1', {
      signal: undefined,
    })
    expect(normalizeProductMock).toHaveBeenCalledWith(product)
    expect(cacheMock.set).toHaveBeenCalledWith('product:phone/1', product)
  })

  it('uses independent cache keys for different product IDs', async () => {
    apiClientMock
      .mockResolvedValueOnce({ id: '1' })
      .mockResolvedValueOnce({ id: '2' })

    await productsApi.getProduct('1')
    await productsApi.getProduct('2')

    expect(cacheMock.get).toHaveBeenNthCalledWith(1, 'product:1')
    expect(cacheMock.get).toHaveBeenNthCalledWith(2, 'product:2')
  })

  it.each([undefined, null, ''])('rejects the missing product ID %s', async (id) => {
    await expect(productsApi.getProduct(id)).rejects.toThrow(
      new TypeError('A product ID is required.'),
    )
    expect(cacheMock.get).not.toHaveBeenCalled()
    expect(apiClientMock).not.toHaveBeenCalled()
  })

  it('does not cache a failed request', async () => {
    const error = new Error('Request failed')
    apiClientMock.mockRejectedValue(error)

    await expect(productsApi.getProducts()).rejects.toBe(error)
    expect(cacheMock.set).not.toHaveBeenCalled()
  })
})
