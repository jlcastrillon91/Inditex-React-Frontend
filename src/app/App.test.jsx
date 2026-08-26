import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { Header } from '@/app/layouts/Header'
import { CartProvider } from '@/features/cart'

describe('application shell', () => {
  it('renders the home link', () => {
    render(
      <MemoryRouter>
        <CartProvider
          storage={{ getCount: () => 4, setCount: vi.fn() }}
        >
          <Header />
        </CartProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /mobile store/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('status', { name: '4 items in cart' })).toHaveTextContent(
      'Cart4',
    )
  })
})
