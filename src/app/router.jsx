import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/app/layouts/AppLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductListPage } from '@/pages/ProductListPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <ProductListPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
