import storage from 'localstorage-slim'

const DEFAULT_NAMESPACE = 'itx:cache'
const DEFAULT_TTL_SECONDS = 60 * 60
const DEFAULT_VERSION = 2

function isValidEntry(entry, version) {
  return (
    entry !== null &&
    typeof entry === 'object' &&
    entry.version === version &&
    Object.hasOwn(entry, 'data')
  )
}

export function createCache({
  client = storage,
  namespace = DEFAULT_NAMESPACE,
  ttlSeconds = DEFAULT_TTL_SECONDS,
  version = DEFAULT_VERSION,
} = {}) {
  function createKey(key) {
    return `${namespace}:${key}`
  }

  return Object.freeze({
    get(key) {
      const storageKey = createKey(key)

      try {
        const entry = client.get(storageKey)

        if (entry === null) {
          return null
        }

        if (!isValidEntry(entry, version)) {
          client.remove(storageKey)
          return null
        }

        return entry.data
      } catch {
        return null
      }
    },

    remove(key) {
      try {
        client.remove(createKey(key))
      } catch {
        // Cache removal must never interrupt the application flow.
      }
    },

    set(key, data) {
      try {
        return (
          client.set(
            createKey(key),
            { data, version },
            { ttl: ttlSeconds },
          ) !== false
        )
      } catch {
        return false
      }
    },
  })
}

export const cache = createCache()
