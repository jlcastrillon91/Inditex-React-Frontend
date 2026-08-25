import { useCallback, useEffect, useState } from 'react'

import { productsApi } from '@/features/products/api/productsApi'

function createInitialState(productId) {
  return {
    error: null,
    product: null,
    status: productId === undefined || productId === null || productId === ''
      ? 'idle'
      : 'loading',
  }
}

function isAbortError(error) {
  return error?.name === 'AbortError'
}

export function useProduct(productId) {
  const [requestVersion, setRequestVersion] = useState(0)
  const [state, setState] = useState(() => createInitialState(productId))
  const hasProductId =
    productId !== undefined && productId !== null && productId !== ''

  const retry = useCallback(() => {
    if (!hasProductId) return

    setState((currentState) => ({
      ...currentState,
      error: null,
      status: 'loading',
    }))
    setRequestVersion((version) => version + 1)
  }, [hasProductId])

  useEffect(() => {
    if (!hasProductId) return undefined

    const controller = new AbortController()

    Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        setState({ error: null, product: null, status: 'loading' })
      }
    })

    productsApi
      .getProduct(productId, { signal: controller.signal })
      .then((product) => {
        setState({ error: null, product, status: 'success' })
      })
      .catch((error) => {
        if (isAbortError(error)) return

        setState({ error, product: null, status: 'error' })
      })

    return () => controller.abort()
  }, [hasProductId, productId, requestVersion])

  return {
    error: state.error,
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    product: state.product,
    retry,
    status: state.status,
  }
}
