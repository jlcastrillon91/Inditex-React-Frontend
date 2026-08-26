import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { ProductGrid } from '@/features/products/components/ProductGrid'
import { createProductFixture } from '@/features/products/test/productFixtures'

describe('ProductGrid', () => {
  it('renders every product in an accessible list', () => {
    const products = [
      createProductFixture({ id: '1', model: 'Galaxy S24' }),
      createProductFixture({ brand: 'Google', id: '2', model: 'Pixel 9' }),
    ]

    render(
      <MemoryRouter>
        <ProductGrid products={products} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('list', { name: 'Product catalogue' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Galaxy S24' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pixel 9' })).toBeInTheDocument()
  })

  it('renders an empty list without failing', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={[]} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('list')).toBeEmptyDOMElement()
  })
})
