import { ApiError } from '@/shared/api/apiError'
import { environment } from '@/shared/config/environment'

const JSON_CONTENT_TYPE = 'application/json'

function createUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${environment.apiBaseUrl}${normalizedPath}`
}

function isSerializableBody(body) {
  return typeof body !== 'string' && !(body instanceof FormData)
}

function createRequestOptions(options) {
  const { body, headers, ...requestOptions } = options
  const hasBody = body !== undefined

  return {
    ...requestOptions,
    headers: {
      Accept: JSON_CONTENT_TYPE,
      ...(hasBody && isSerializableBody(body)
        ? { 'Content-Type': JSON_CONTENT_TYPE }
        : {}),
      ...headers,
    },
    ...(hasBody
      ? { body: isSerializableBody(body) ? JSON.stringify(body) : body }
      : {}),
  }
}

async function parseResponse(response) {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type')

  if (!contentType?.includes(JSON_CONTENT_TYPE)) {
    return undefined
  }

  try {
    return await response.json()
  } catch (cause) {
    throw new ApiError('The API returned invalid JSON.', {
      cause,
      status: response.status,
    })
  }
}

export async function apiClient(path, options = {}) {
  let response

  try {
    response = await fetch(createUrl(path), createRequestOptions(options))
  } catch (cause) {
    if (cause.name === 'AbortError') {
      throw cause
    }

    throw new ApiError('Unable to connect to the API.', { cause })
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}.`,
      { data, status: response.status },
    )
  }

  return data
}
