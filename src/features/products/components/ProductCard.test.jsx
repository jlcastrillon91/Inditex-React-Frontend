import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProductCard } from '@/features/products/components/ProductCard'
import { createProductFixture } from '@/features/products/test/productFixtures'

function renderCard(product = createProductFixture()) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  )
}

describe('ProductCard', () => {
  it('shows the required product information and detail link', () => {
    renderCard()

    expect(screen.getByText('Samsung')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Galaxy S24' })).toBeInTheDocument()
    expect(screen.getByText('€799.00')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Samsung Galaxy S24' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View Samsung Galaxy S24 details' }),
    ).toHaveAttribute('href', '/product/1')
  })

  it('encodes the product ID in the detail URL', () => {
    renderCard(createProductFixture({ id: 'phone/one' }))

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/product/phone%2Fone',
    )
  })

  it('shows a fallback when the product has no image', () => {
    renderCard(createProductFixture({ imageUrl: null }))

    expect(
      screen.getByRole('img', { name: 'Samsung Galaxy S24 image unavailable' }),
    ).toBeInTheDocument()
  })

  it('replaces an image that fails to load', () => {
    renderCard()

    fireEvent.error(screen.getByRole('img', { name: 'Samsung Galaxy S24' }))

    expect(
      screen.getByRole('img', { name: 'Samsung Galaxy S24 image unavailable' }),
    ).toBeInTheDocument()
  })

  it('shows safe fallbacks for incomplete catalogue information', () => {
    renderCard(
      createProductFixture({ brand: '', imageUrl: null, model: '', price: null }),
    )

    expect(screen.getByText('Unknown brand')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Unknown model' })).toBeInTheDocument()
    expect(screen.getByText('Price pending')).toBeInTheDocument()
  })
})
