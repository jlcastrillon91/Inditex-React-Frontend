import { describe, expect, it } from 'vitest'

import { formatProductCameras } from '@/features/products/formatters/formatProductCameras'

describe('formatProductCameras', () => {
  it('formats primary and secondary camera groups', () => {
    expect(formatProductCameras(['50 MP', '12 MP'], ['10 MP'])).toBe(
      'Primary: 50 MP, 12 MP · Secondary: 10 MP',
    )
  })

  it('handles one or no available camera groups', () => {
    expect(formatProductCameras(['50 MP'], [])).toBe('Primary: 50 MP')
    expect(formatProductCameras()).toBe('Not available')
  })
})
