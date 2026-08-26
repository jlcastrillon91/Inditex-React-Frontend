import { describe, expect, it } from 'vitest'

import { formatValue } from '@/shared/formatters/formatValue'

describe('formatValue', () => {
  it('preserves available values including zero', () => {
    expect(formatValue('8 GB')).toBe('8 GB')
    expect(formatValue(0)).toBe(0)
  })

  it('uses a fallback only for missing values', () => {
    expect(formatValue(null)).toBe('Not available')
    expect(formatValue(undefined)).toBe('Not available')
    expect(formatValue('')).toBe('Not available')
    expect(formatValue('', { fallback: 'Unknown' })).toBe('Unknown')
  })
})
