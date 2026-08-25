import { describe, expect, it } from 'vitest'

import {
  normalizeProduct,
  normalizeProducts,
} from '@/features/products/model/normalizeProduct'

describe('normalizeProduct', () => {
  it('maps a complete API product to the application model', () => {
    expect(
      normalizeProduct({
        battery: '3000 mAh',
        brand: 'Acme',
        cpu: 'Octa Core',
        dimentions: '150 x 70 x 8 mm',
        displayResolution: '1080 x 2400',
        id: 42,
        imgUrl: 'https://example.com/phone.jpg',
        model: 'Phone Pro',
        options: {
          colors: [{ code: 1, name: 'Black' }],
          storages: [{ code: 2, name: '128 GB' }],
        },
        os: 'Android',
        price: '499.95',
        primaryCamera: ['50 MP', '12 MP'],
        ram: '8 GB',
        secondaryCmera: '16 MP',
        weight: 180,
      }),
    ).toEqual({
      battery: '3000 mAh',
      brand: 'Acme',
      colors: [{ code: 1, name: 'Black' }],
      cpu: 'Octa Core',
      dimensions: '150 x 70 x 8 mm',
      displayResolution: '1080 x 2400',
      id: '42',
      imageUrl: 'https://example.com/phone.jpg',
      model: 'Phone Pro',
      operatingSystem: 'Android',
      price: 499.95,
      primaryCamera: ['50 MP', '12 MP'],
      ram: '8 GB',
      secondaryCamera: ['16 MP'],
      storageOptions: [{ code: 2, name: '128 GB' }],
      weight: '180',
    })
  })

  it('provides stable defaults for missing optional data', () => {
    expect(normalizeProduct({ id: '1' })).toEqual({
      battery: null,
      brand: '',
      colors: [],
      cpu: null,
      dimensions: null,
      displayResolution: null,
      id: '1',
      imageUrl: null,
      model: '',
      operatingSystem: null,
      price: null,
      primaryCamera: [],
      ram: null,
      secondaryCamera: [],
      storageOptions: [],
      weight: null,
    })
  })

  it('prefers correctly named fields over legacy API aliases', () => {
    const product = normalizeProduct({
      dimensions: 'correct dimensions',
      dimentions: 'legacy dimensions',
      imageUrl: 'correct-image.jpg',
      imgUrl: 'legacy-image.jpg',
      operatingSystem: 'Correct OS',
      os: 'Legacy OS',
      secondaryCamera: '20 MP',
      secondaryCmera: '10 MP',
    })

    expect(product).toMatchObject({
      dimensions: 'correct dimensions',
      imageUrl: 'correct-image.jpg',
      operatingSystem: 'Correct OS',
      secondaryCamera: ['20 MP'],
    })
  })

  it('normalizes camera strings, arrays, and empty entries', () => {
    const product = normalizeProduct({
      primaryCamera: '50 MP',
      secondaryCamera: ['12 MP', null, '', '8 MP'],
    })

    expect(product.primaryCamera).toEqual(['50 MP'])
    expect(product.secondaryCamera).toEqual(['12 MP', '8 MP'])
  })

  it('filters invalid options while preserving option codes', () => {
    const product = normalizeProduct({
      colors: [
        { code: 0, name: 'Black' },
        null,
        { code: null, name: 'Invalid' },
      ],
      storages: [{ code: '128', name: 128 }],
    })

    expect(product.colors).toEqual([{ code: 0, name: 'Black' }])
    expect(product.storageOptions).toEqual([{ code: '128', name: '128' }])
  })

  it('does not mutate the raw API object', () => {
    const product = {
      id: 1,
      options: { colors: [{ code: 1, name: 'Black' }] },
    }
    const snapshot = structuredClone(product)

    normalizeProduct(product)

    expect(product).toEqual(snapshot)
  })

  it.each([null, undefined, [], 'product'])('rejects invalid product data %j', (value) => {
    expect(() => normalizeProduct(value)).toThrow(
      new TypeError('Product data must be an object.'),
    )
  })
})

describe('normalizeProducts', () => {
  it('normalizes every product without mutating the list', () => {
    const products = [{ id: 1 }, { id: 2 }]

    const normalized = normalizeProducts(products)

    expect(normalized.map((product) => product.id)).toEqual(['1', '2'])
    expect(products).toEqual([{ id: 1 }, { id: 2 }])
  })

  it.each([null, {}, 'products'])('rejects invalid product-list data %j', (value) => {
    expect(() => normalizeProducts(value)).toThrow(
      new TypeError('Product list data must be an array.'),
    )
  })
})
