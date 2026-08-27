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
      screen.getByRole('heading', { name: 'Find your next device' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Curating the latest devices…')).toBeInTheDocument()
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

    expect(
      screen.getByText('Explore 2 mobile devices selected for the collection.'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows only the first twelve products and paginates the catalogue', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
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
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('filters by brand and shows a no-results state', () => {
    useProductsMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: false,
      products: [
        createProductFixture(),
        createProductFixture({ brand: 'Google', id: '2', model: 'Pixel 9' }),
      ],
      retry: vi.fn(),
    })
    renderPage()

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: 'Search products by brand or model',
      }),
      { target: { value: 'google' } },
    )

    expect(screen.getByText('Showing 1 matching device')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pixel 9' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Galaxy S24' }),
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Nokia' },
    })

    expect(
      screen.getByRole('heading', { name: 'No matching devices' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Showing 0 matching devices')).toBeInTheDocument()
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
    expect(
      screen.getByText('Explore 0 mobile devices selected for the collection.'),
    ).toBeInTheDocument()
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
