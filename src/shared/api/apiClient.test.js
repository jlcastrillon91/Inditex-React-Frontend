import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from '@/shared/api/apiClient'
import { ApiError } from '@/shared/api/apiError'

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

describe('apiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('performs a GET request against the configured API URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ id: '1' }]))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiClient('/api/product')).resolves.toEqual([{ id: '1' }])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://itx-frontend-test.onrender.com/api/product',
      {
        headers: { Accept: 'application/json' },
      },
    )
  })

  it('serializes a plain object body as JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ count: 1 }))
    vi.stubGlobal('fetch', fetchMock)

    await apiClient('/api/cart', {
      body: { colorCode: 1, id: '1', storageCode: 2 },
      method: 'POST',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://itx-frontend-test.onrender.com/api/cart',
      {
        body: JSON.stringify({ colorCode: 1, id: '1', storageCode: 2 }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )
  })

  it('returns undefined for a response without content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    )

    await expect(apiClient('/api/empty')).resolves.toBeUndefined()
  })

  it('throws an ApiError containing HTTP response details', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          jsonResponse({ message: 'Product not found' }, { status: 404 }),
        ),
    )

    await expect(apiClient('/api/product/missing')).rejects.toMatchObject({
      data: { message: 'Product not found' },
      message: 'Product not found',
      name: 'ApiError',
      status: 404,
    })
  })

  it('wraps network failures in an ApiError', async () => {
    const networkError = new TypeError('Failed to fetch')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(networkError))

    await expect(apiClient('/api/product')).rejects.toEqual(
      expect.objectContaining({
        cause: networkError,
        message: 'Unable to connect to the API.',
      }),
    )
  })

  it('preserves AbortError so callers can ignore cancelled requests', async () => {
    const abortError = new DOMException('Request cancelled', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError))

    await expect(apiClient('/api/product')).rejects.toBe(abortError)
  })

  it('reports malformed JSON responses consistently', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{invalid', {
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    const request = apiClient('/api/product')

    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({
      message: 'The API returned invalid JSON.',
      status: 200,
    })
  })
})
