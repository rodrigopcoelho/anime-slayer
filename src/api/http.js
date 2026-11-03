export class ApiError extends Error {
  constructor(message, { status } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Retry network hiccups and server errors, but never hammer a rate limit.
export function shouldRetry(failureCount, error) {
  if (failureCount >= 2) return false
  const status = error?.status
  return status === undefined || status >= 500
}

export function errorMessage(error) {
  if (error?.status === 429) return 'Too many requests — give the API a minute to cool down.'
  if (error?.name === 'TypeError') return 'Network error — check your connection.'
  return error?.message || 'Something went wrong.'
}
