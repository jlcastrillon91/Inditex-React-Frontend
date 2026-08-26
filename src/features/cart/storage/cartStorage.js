import storage from 'localstorage-slim'

const CART_COUNT_KEY = 'itx:cart-count'

export function isValidCartCount(value) {
  return Number.isInteger(value) && value >= 0
}

export function createCartStorage({ client = storage, key = CART_COUNT_KEY } = {}) {
  return Object.freeze({
    getCount() {
      try {
        const count = client.get(key)

        if (isValidCartCount(count)) return count

        if (count !== null) client.remove(key)
        return 0
      } catch {
        return 0
      }
    },

    setCount(count) {
      if (!isValidCartCount(count)) return false

      try {
        return client.set(key, count) !== false
      } catch {
        return false
      }
    },
  })
}

export const cartStorage = createCartStorage()
