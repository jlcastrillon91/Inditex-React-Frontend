import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/app/layouts/AppLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductDetailsPage } from '@/pages/ProductDetailsPage'
import { ProductListPage } from '@/pages/ProductListPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <ProductListPage /> },
      { path: '/product/:productId', element: <ProductDetailsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
