const euroFormatter = new Intl.NumberFormat('en-IE', {
  currency: 'EUR',
  maximumFractionDigits: 2,
  style: 'currency',
})

export function formatCurrency(value, { fallback = 'Not available' } = {}) {
  return value === null || value === undefined
    ? fallback
    : euroFormatter.format(value)
}
