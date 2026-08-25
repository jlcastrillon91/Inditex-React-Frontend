import { Outlet } from 'react-router-dom'

import { Header } from '@/app/layouts/Header'

export function AppLayout() {
  return (
    <div className="min-h-svh">
      <Header />
      <Outlet />
    </div>
  )
}
