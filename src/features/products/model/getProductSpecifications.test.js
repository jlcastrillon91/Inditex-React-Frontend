import { describe, expect, it } from 'vitest'

import { getProductSpecifications } from '@/features/products/model/getProductSpecifications'
import { createProductFixture } from '@/features/products/test/productFixtures'

describe('getProductSpecifications', () => {
  it('creates display-ready rows in the required order', () => {
    const specifications = getProductSpecifications(
      createProductFixture({ primaryCamera: ['50 MP'], ram: '8 GB' }),
    )

    expect(specifications.map(({ label }) => label)).toEqual([
      'Brand',
      'Model',
      'Price',
      'CPU',
      'RAM',
      'Operating system',
      'Display resolution',
      'Battery',
      'Cameras',
      'Dimensions',
      'Weight',
    ])
    expect(specifications.find(({ label }) => label === 'Price')?.value).toBe(
      '€799.00',
    )
    expect(specifications.find(({ label }) => label === 'RAM')?.value).toBe(
      '8 GB',
    )
  })
})
