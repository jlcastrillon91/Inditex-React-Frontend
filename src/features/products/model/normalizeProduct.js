function assertProduct(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Product data must be an object.')
  }
}

function normalizeRequiredText(value) {
  return value === null || value === undefined ? '' : String(value)
}

function normalizeOptionalText(value) {
  return value === null || value === undefined || value === ''
    ? null
    : String(value)
}

function normalizePrice(value) {
  if (value === null || value === undefined || value === '') return null

  const price = typeof value === 'number' ? value : Number(value)

  return Number.isFinite(price) ? price : null
}

function normalizeStringList(value) {
  if (value === null || value === undefined || value === '') return []

  const values = Array.isArray(value) ? value : [value]

  return values
    .filter((item) => item !== null && item !== undefined && item !== '')
    .map(String)
}

function normalizeOptions(value) {
  if (!Array.isArray(value)) return []

  return value
    .filter((option) => option && typeof option === 'object')
    .map((option) => ({
      code: option.code,
      name: normalizeRequiredText(option.name),
    }))
    .filter(
      (option) =>
        option.code !== null &&
        option.code !== undefined &&
        option.code !== '' &&
        option.name.trim() !== '',
    )
}

export function normalizeProduct(product) {
  assertProduct(product)

  return {
    id: normalizeRequiredText(product.id),
    brand: normalizeRequiredText(product.brand),
    model: normalizeRequiredText(product.model),
    price: normalizePrice(product.price),
    imageUrl: normalizeOptionalText(product.imageUrl ?? product.imgUrl),
    cpu: normalizeOptionalText(product.cpu),
    ram: normalizeOptionalText(product.ram),
    operatingSystem: normalizeOptionalText(
      product.operatingSystem ?? product.os,
    ),
    displayResolution: normalizeOptionalText(product.displayResolution),
    battery: normalizeOptionalText(product.battery),
    primaryCamera: normalizeStringList(product.primaryCamera),
    secondaryCamera: normalizeStringList(
      product.secondaryCamera ?? product.secondaryCmera,
    ),
    dimensions: normalizeOptionalText(product.dimensions ?? product.dimentions),
    weight: normalizeOptionalText(product.weight),
    colors: normalizeOptions(product.options?.colors ?? product.colors),
    storageOptions: normalizeOptions(
      product.options?.storages ?? product.storageOptions ?? product.storages,
    ),
  }
}

export function normalizeProducts(products) {
  if (!Array.isArray(products)) {
    throw new TypeError('Product list data must be an array.')
  }

  return products.map(normalizeProduct)
}
