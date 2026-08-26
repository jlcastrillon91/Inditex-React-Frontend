import { describe, expect, it } from 'vitest'

import { formatCurrency } from '@/shared/formatters/formatCurrency'

describe('formatCurrency', () => {
  it('formats euro values consistently', () => {
    expect(formatCurrency(799)).toBe('€799.00')
    expect(formatCurrency(0)).toBe('€0.00')
  })

  it('uses the configured fallback for missing values', () => {
    expect(formatCurrency(null)).toBe('Not available')
    expect(formatCurrency(undefined, { fallback: 'Price unavailable' })).toBe(
      'Price unavailable',
    )
  })
})
