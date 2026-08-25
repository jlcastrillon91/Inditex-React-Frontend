import { useCallback, useEffect, useState } from 'react'

import { productsApi } from '@/features/products/api/productsApi'

const initialState = {
  error: null,
  products: [],
  status: 'loading',
}

function isAbortError(error) {
  return error?.name === 'AbortError'
}

export function useProducts() {
  const [requestVersion, setRequestVersion] = useState(0)
  const [state, setState] = useState(initialState)

  const retry = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      error: null,
      status: 'loading',
    }))
    setRequestVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    productsApi
      .getProducts({ signal: controller.signal })
      .then((products) => {
        setState({ error: null, products, status: 'success' })
      })
      .catch((error) => {
        if (isAbortError(error)) return

        setState({ error, products: [], status: 'error' })
      })

    return () => controller.abort()
  }, [requestVersion])

  return {
    error: state.error,
    isError: state.status === 'error',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    products: state.products,
    retry,
    status: state.status,
  }
}
