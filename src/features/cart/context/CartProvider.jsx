import { useCallback, useEffect, useMemo, useState } from 'react'

import { CartContext } from '@/features/cart/context/CartContext'
import {
  cartStorage,
  isValidCartCount,
} from '@/features/cart/storage/cartStorage'

export function CartProvider({ children, storage = cartStorage }) {
  const [count, setCountState] = useState(() => storage.getCount())

  const setCount = useCallback((nextCount) => {
    if (!isValidCartCount(nextCount)) {
      throw new TypeError('Cart count must be a non-negative integer.')
    }

    setCountState(nextCount)
  }, [])

  useEffect(() => {
    storage.setCount(count)
  }, [count, storage])

  const value = useMemo(() => ({ count, setCount }), [count, setCount])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
