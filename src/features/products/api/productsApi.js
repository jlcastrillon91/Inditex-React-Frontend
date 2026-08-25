import { apiClient } from '@/shared/api/apiClient'
import { cache } from '@/shared/storage/cache'
import {
  normalizeProduct,
  normalizeProducts,
} from '@/features/products/model/normalizeProduct'

const PRODUCTS_CACHE_KEY = 'products'

function createProductCacheKey(productId) {
  return `product:${productId}`
}

export const productsApi = {
  async getProducts({ signal } = {}) {
    const cachedProducts = cache.get(PRODUCTS_CACHE_KEY)

    if (cachedProducts !== null) return cachedProducts

    const response = await apiClient('/api/product', { signal })
    const products = normalizeProducts(response)
    cache.set(PRODUCTS_CACHE_KEY, products)

    return products
  },

  async getProduct(productId, { signal } = {}) {
    if (productId === undefined || productId === null || productId === '') {
      throw new TypeError('A product ID is required.')
    }

    const normalizedProductId = String(productId)
    const cacheKey = createProductCacheKey(normalizedProductId)
    const cachedProduct = cache.get(cacheKey)

    if (cachedProduct !== null) return cachedProduct

    const response = await apiClient(
      `/api/product/${encodeURIComponent(normalizedProductId)}`,
      { signal },
    )
    const product = normalizeProduct(response)

    cache.set(cacheKey, product)

    return product
  },
}
