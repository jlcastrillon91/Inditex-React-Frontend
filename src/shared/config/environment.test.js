import { describe, expect, it } from 'vitest'

import { createEnvironment } from '@/shared/config/environment'

describe('createEnvironment', () => {
  it('normalizes the configured API URL', () => {
    expect(
      createEnvironment({ VITE_API_BASE_URL: 'https://api.example.com/' }),
    ).toEqual({ apiBaseUrl: 'https://api.example.com' })
  })

  it('uses the development API when no URL is configured', () => {
    expect(createEnvironment({}).apiBaseUrl).toBe(
      'https://itx-frontend-test.onrender.com',
    )
  })

  it('rejects invalid and unsupported URLs', () => {
    expect(() =>
      createEnvironment({ VITE_API_BASE_URL: 'file:///products.json' }),
    ).toThrow('VITE_API_BASE_URL must be a valid HTTP or HTTPS URL.')
  })
})
