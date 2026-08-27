import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { router } from '@/app/router'
import { CartProvider } from '@/features/cart'

export function App({ theme }) {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ThemeProvider>
  )
}
