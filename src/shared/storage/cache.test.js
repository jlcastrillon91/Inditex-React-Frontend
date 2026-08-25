import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createCache } from '@/shared/storage/cache'

function createStorageClient() {
  return {
    get: vi.fn(),
    remove: vi.fn(),
    set: vi.fn(),
  }
}

describe('cache', () => {
  let client
  let cache

  beforeEach(() => {
    client = createStorageClient()
    cache = createCache({ client })
  })

  it('stores a versioned entry with a one-hour TTL', () => {
    const products = [{ id: '1' }]

    expect(cache.set('products', products)).toBe(true)
    expect(client.set).toHaveBeenCalledWith(
      'itx:cache:products',
      { data: products, version: 1 },
      { ttl: 3600 },
    )
  })

  it('returns data from a valid cache entry', () => {
    const product = { id: '1' }
    client.get.mockReturnValue({ data: product, version: 1 })

    expect(cache.get('product:1')).toBe(product)
    expect(client.get).toHaveBeenCalledWith('itx:cache:product:1')
  })

  it.each([0, false, null])('preserves the falsy value %s', (value) => {
    client.get.mockReturnValue({ data: value, version: 1 })

    expect(cache.get('value')).toBe(value)
  })

  it('returns null for a cache miss', () => {
    client.get.mockReturnValue(null)

    expect(cache.get('missing')).toBeNull()
    expect(client.remove).not.toHaveBeenCalled()
  })

  it('removes entries from an incompatible schema version', () => {
    client.get.mockReturnValue({ data: ['stale'], version: 0 })

    expect(cache.get('products')).toBeNull()
    expect(client.remove).toHaveBeenCalledWith('itx:cache:products')
  })

  it.each([
    undefined,
    'invalid',
    [],
    { version: 1 },
  ])('removes the malformed entry %j', (entry) => {
    client.get.mockReturnValue(entry)

    expect(cache.get('products')).toBeNull()
    expect(client.remove).toHaveBeenCalledWith('itx:cache:products')
  })

  it('removes a cached value by its namespaced key', () => {
    cache.remove('products')

    expect(client.remove).toHaveBeenCalledWith('itx:cache:products')
  })

  it('returns false when the storage client rejects a write', () => {
    client.set.mockReturnValue(false)

    expect(cache.set('products', [])).toBe(false)
  })

  it('does not expose storage read, write, or removal failures', () => {
    client.get.mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    client.set.mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    client.remove.mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    expect(cache.get('products')).toBeNull()
    expect(cache.set('products', [])).toBe(false)
    expect(() => cache.remove('products')).not.toThrow()
  })

  it('supports a custom namespace, version, and TTL', () => {
    const customCache = createCache({
      client,
      namespace: 'storefront',
      ttlSeconds: 30,
      version: 2,
    })

    customCache.set('products', [])

    expect(client.set).toHaveBeenCalledWith(
      'storefront:products',
      { data: [], version: 2 },
      { ttl: 30 },
    )
  })
})
