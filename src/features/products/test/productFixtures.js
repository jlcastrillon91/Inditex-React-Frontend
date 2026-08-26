export const productFixture = {
  battery: null,
  brand: 'Samsung',
  colors: [],
  cpu: null,
  dimensions: null,
  displayResolution: null,
  id: '1',
  imageUrl: 'https://example.com/galaxy-s24.jpg',
  model: 'Galaxy S24',
  operatingSystem: null,
  price: 799,
  primaryCamera: [],
  ram: null,
  secondaryCamera: [],
  storageOptions: [],
  weight: null,
}

export function createProductFixture(overrides = {}) {
  return { ...productFixture, ...overrides }
}
