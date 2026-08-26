import { apiClient } from '@/shared/api/apiClient'

function isMissing(value) {
  return value === undefined || value === null || value === ''
}

function assertRequired(value, name) {
  if (isMissing(value)) {
    throw new TypeError(`${name} is required.`)
  }
}

function getAuthoritativeCount(response) {
  if (!Number.isInteger(response?.count) || response.count < 0) {
    throw new TypeError('The cart API returned an invalid count.')
  }

  return response.count
}

export const cartApi = {
  async addProduct({ colorCode, productId, signal, storageCode } = {}) {
    assertRequired(productId, 'A product ID')
    assertRequired(colorCode, 'A color code')
    assertRequired(storageCode, 'A storage code')

    const response = await apiClient('/api/cart', {
      body: {
        colorCode,
        id: productId,
        storageCode,
      },
      method: 'POST',
      signal,
    })

    return getAuthoritativeCount(response)
  },
}
