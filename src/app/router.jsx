import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@/app/layouts/AppLayout'
import { NotFoundPage } from '@/app/pages/NotFoundPage'
import { StarterPage } from '@/app/pages/StarterPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <StarterPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
