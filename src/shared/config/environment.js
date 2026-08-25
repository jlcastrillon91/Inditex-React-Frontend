const DEFAULT_API_BASE_URL = 'https://itx-frontend-test.onrender.com'

function parseApiBaseUrl(value) {
  try {
    const url = new URL(value)

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Unsupported protocol')
    }

    return url.toString().replace(/\/$/, '')
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid HTTP or HTTPS URL.')
  }
}

export function createEnvironment(source = import.meta.env) {
  return Object.freeze({
    apiBaseUrl: parseApiBaseUrl(
      source.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL,
    ),
  })
}

export const environment = createEnvironment()
