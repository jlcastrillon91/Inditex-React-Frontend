import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router'
import { CartProvider } from '@/features/cart'

export function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
