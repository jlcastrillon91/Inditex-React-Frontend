import { useCallback, useRef, useState } from 'react'

import { cartApi } from '@/features/cart/api/cartApi'
import { useCart } from '@/features/cart/hooks/useCart'

const initialState = {
  error: null,
  status: 'idle',
}

function isAbortError(error) {
  return error?.name === 'AbortError'
}

export function useAddProduct() {
  const { setCount } = useCart()
  const [state, setState] = useState(initialState)
  const activeRequestRef = useRef(null)

  const addProduct = useCallback(
    (configuration) => {
      if (activeRequestRef.current) {
        return activeRequestRef.current.promise
      }

      const request = {
        controller: new AbortController(),
        promise: null,
      }

      setState({ error: null, status: 'pending' })

      request.promise = cartApi
        .addProduct(configuration, { signal: request.controller.signal })
        .then((count) => {
          setCount(count)
          setState({ error: null, status: 'success' })
          return count
        })
        .catch((error) => {
          if (isAbortError(error)) {
            setState(initialState)
          } else {
            setState({ error, status: 'error' })
          }

          throw error
        })
        .finally(() => {
          if (activeRequestRef.current === request) {
            activeRequestRef.current = null
          }
        })

      activeRequestRef.current = request
      return request.promise
    },
    [setCount],
  )

  const cancel = useCallback(() => {
    activeRequestRef.current?.controller.abort()
  }, [])

  const reset = useCallback(() => {
    if (!activeRequestRef.current) setState(initialState)
  }, [])

  return {
    addProduct,
    cancel,
    error: state.error,
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isSuccess: state.status === 'success',
    reset,
    status: state.status,
  }
}
