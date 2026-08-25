import { describe, expect, it } from 'vitest'

import { ApiError } from '@/shared/api/apiError'

describe('ApiError', () => {
  it('is identifiable as both ApiError and Error', () => {
    const error = new ApiError('Request failed')

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.message).toBe('Request failed')
  })

  it('retains HTTP status and response data', () => {
    const data = { code: 'PRODUCT_NOT_FOUND' }
    const error = new ApiError('Product not found', { data, status: 404 })

    expect(error.status).toBe(404)
    expect(error.data).toBe(data)
  })

  it('retains the original error as its cause', () => {
    const cause = new TypeError('Failed to fetch')
    const error = new ApiError('Unable to connect to the API.', { cause })

    expect(error.cause).toBe(cause)
  })
})
