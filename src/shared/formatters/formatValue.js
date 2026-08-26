export function formatValue(value, { fallback = 'Not available' } = {}) {
  return value === null || value === undefined || value === '' ? fallback : value
}
