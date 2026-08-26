import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { Header } from '@/app/layouts/Header'
import { CartProvider } from '@/features/cart'

describe('application shell', () => {
  it('renders the home link, current page, and cart count', () => {
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
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveTextContent(
      'Products',
    )
    expect(screen.getByText('Products')).toHaveAttribute('aria-current', 'page')
  })

  it('links back to products from the product-detail breadcrumb', () => {
    render(
      <MemoryRouter initialEntries={['/product/product-123']}>
        <CartProvider storage={{ getCount: () => 0, setCount: vi.fn() }}>
          <Header />
        </CartProvider>
      </MemoryRouter>,
    )

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })

    expect(breadcrumb).toHaveTextContent('ProductsProduct details')
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByText('Product details')).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
