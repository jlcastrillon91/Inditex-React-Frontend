import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createCartStorage,
  isValidCartCount,
} from '@/features/cart/storage/cartStorage'

function createStorageClient() {
  return {
    get: vi.fn(),
    remove: vi.fn(),
    set: vi.fn(),
  }
}

describe('cartStorage', () => {
  let client
  let storage

  beforeEach(() => {
    client = createStorageClient()
    storage = createCartStorage({ client })
  })

  it('reads a persisted cart count', () => {
    client.get.mockReturnValue(4)

    expect(storage.getCount()).toBe(4)
    expect(client.get).toHaveBeenCalledWith('itx:cart-count')
  })

  it.each([null, undefined, '4', -1, 1.5, {}, []])(
    'recovers safely from the invalid persisted value %j',
    (value) => {
      client.get.mockReturnValue(value)

      expect(storage.getCount()).toBe(0)
      if (value !== null) {
        expect(client.remove).toHaveBeenCalledWith('itx:cart-count')
      }
    },
  )

  it('persists a valid count without expiration', () => {
    expect(storage.setCount(3)).toBe(true)
    expect(client.set).toHaveBeenCalledWith('itx:cart-count', 3)
  })

  it.each([-1, 1.5, '2', null, undefined])(
    'rejects the invalid count %j',
    (count) => {
      expect(storage.setCount(count)).toBe(false)
      expect(client.set).not.toHaveBeenCalled()
    },
  )

  it('does not expose storage failures', () => {
    client.get.mockImplementation(() => {
      throw new Error('Storage unavailable')
    })
    client.set.mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

    expect(storage.getCount()).toBe(0)
    expect(storage.setCount(2)).toBe(false)
  })
})

describe('isValidCartCount', () => {
  it('accepts only non-negative integers', () => {
    expect(isValidCartCount(0)).toBe(true)
    expect(isValidCartCount(3)).toBe(true)
    expect(isValidCartCount(-1)).toBe(false)
    expect(isValidCartCount(1.5)).toBe(false)
    expect(isValidCartCount('3')).toBe(false)
  })
})
