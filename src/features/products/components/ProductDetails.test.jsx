import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProductDetails } from '@/features/products/components/ProductDetails'
import { createProductFixture } from '@/features/products/test/productFixtures'

describe('ProductDetails', () => {
  it('renders the product name and detail image', () => {
    render(
      <MemoryRouter>
        <ProductDetails product={createProductFixture()} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Samsung Galaxy S24' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Samsung Galaxy S24' }),
    ).toHaveAttribute('src', 'https://example.com/galaxy-s24.jpg')
    expect(screen.getByRole('link', { name: 'Back to products' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.getByRole('region', { name: 'Product details' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Options' })).toBeInTheDocument()
  })

  it('uses a safe product name for incomplete data', () => {
    render(
      <MemoryRouter>
        <ProductDetails
          product={createProductFixture({ brand: '', imageUrl: null, model: '' })}
        />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Unnamed product' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Unnamed product image unavailable' }),
    ).toBeInTheDocument()
  })
})
