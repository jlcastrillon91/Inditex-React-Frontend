import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createProductFixture } from '@/features/products/test/productFixtures'
import { ProductListPage } from '@/pages/ProductListPage'

const { useProductsMock } = vi.hoisted(() => ({
  useProductsMock: vi.fn(),
}))

vi.mock('@/features/products/hooks/useProducts', () => ({
  useProducts: useProductsMock,
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <ProductListPage />
    </MemoryRouter>,
  )
}

describe('ProductListPage', () => {
  beforeEach(() => {
    useProductsMock.mockReset()
  })

  it('shows the catalogue loading state', () => {
    useProductsMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: true,
      products: [],
      retry: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Mobile devices' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Loading the latest devices…')).toBeInTheDocument()
    expect(
      screen.getByRole('status', { name: 'Loading products' }),
    ).toBeInTheDocument()
  })

  it('shows products and their count', () => {
    useProductsMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: false,
      products: [
        createProductFixture(),
        createProductFixture({ id: '2', model: 'Galaxy A55', price: 449 }),
      ],
      retry: vi.fn(),
    })

    renderPage()

    expect(screen.getByText('2 devices available')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows only the first twelve products and paginates the catalogue', () => {
    const products = Array.from({ length: 13 }, (_, index) =>
      createProductFixture({ id: String(index + 1), model: `Phone ${index + 1}` }),
    )
    useProductsMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: false,
      products,
      retry: vi.fn(),
    })

    renderPage()

    expect(screen.getAllByRole('listitem')).toHaveLength(12)
    expect(screen.getByRole('heading', { name: 'Phone 1' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Phone 13' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Go to next page'))

    expect(screen.getByRole('heading', { name: 'Phone 13' })).toBeInTheDocument()
    expect(screen.getByLabelText('Go to next page')).toBeDisabled()
  })

  it('shows an empty state', () => {
    useProductsMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: false,
      products: [],
      retry: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'No devices are available' }),
    ).toBeInTheDocument()
    expect(screen.getByText('0 devices available')).toBeInTheDocument()
  })

  it('shows an error and retries the request', () => {
    const retry = vi.fn()
    useProductsMock.mockReturnValue({
      error: new Error('Catalogue unavailable'),
      isError: true,
      isLoading: false,
      products: [],
      retry,
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Catalogue unavailable')
    expect(retry).toHaveBeenCalledOnce()
  })
})
