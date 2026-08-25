export class ApiError extends Error {
  constructor(message, { cause, data, status } = {}) {
    super(message, { cause })

    this.name = 'ApiError'
    this.data = data
    this.status = status
  }
}
