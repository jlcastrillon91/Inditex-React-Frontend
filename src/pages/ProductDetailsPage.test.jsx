import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ProductDetailsPage } from '@/pages/ProductDetailsPage'

const { addProductMock, resetCartMutationMock, useAddProductMock, useProductMock } =
  vi.hoisted(() => ({
  addProductMock: vi.fn(),
  resetCartMutationMock: vi.fn(),
  useAddProductMock: vi.fn(),
  useProductMock: vi.fn(),
  }))

vi.mock('@/features/products/hooks/useProduct', () => ({
  useProduct: useProductMock,
}))
vi.mock('@/features/cart', () => ({
  useAddProduct: useAddProductMock,
}))

function renderPage(productId = 'product-123') {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProductDetailsPage', () => {
  beforeEach(() => {
    addProductMock.mockReset().mockResolvedValue(1)
    resetCartMutationMock.mockReset()
    useAddProductMock.mockReset().mockReturnValue({
      addProduct: addProductMock,
      error: null,
      isPending: false,
      isSuccess: false,
      reset: resetCartMutationMock,
    })
    useProductMock.mockReset()
  })

  it('fetches the product identified by the route', () => {
    useProductMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: false,
      isSuccess: true,
      product: {
        battery: null,
        brand: 'Samsung',
        colors: [{ code: 1, name: 'Black' }],
        cpu: null,
        dimensions: null,
        displayResolution: null,
        id: 'product-123',
        imageUrl: 'https://example.com/galaxy-s24.jpg',
        model: 'Galaxy S24',
        operatingSystem: null,
        price: 799,
        primaryCamera: [],
        ram: null,
        secondaryCamera: [],
        storageOptions: [{ code: 2, name: '128 GB' }],
        weight: null,
      },
      retry: vi.fn(),
    })

    renderPage()

    expect(useProductMock).toHaveBeenCalledWith('product-123')
    expect(
      screen.getByRole('heading', { name: 'Samsung Galaxy S24' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Samsung Galaxy S24' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }))

    expect(addProductMock).toHaveBeenCalledWith({
      colorCode: 1,
      productId: 'product-123',
      storageCode: 2,
    })
  })

  it('shows a product loading state', () => {
    useProductMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: true,
      isSuccess: false,
      product: null,
      retry: vi.fn(),
    })

    renderPage()

    expect(screen.getByRole('status', { name: 'Loading product' })).toBeInTheDocument()
  })

  it('shows a controlled not-found state for a missing product', () => {
    useProductMock.mockReturnValue({
      error: { message: 'Not found', status: 404 },
      isError: true,
      isLoading: false,
      isSuccess: false,
      product: null,
      retry: vi.fn(),
    })

    renderPage('missing')

    expect(
      screen.getByRole('heading', { name: 'Product not found' }),
    ).toBeInTheDocument()
  })

  it('shows a retryable error', () => {
    const retry = vi.fn()
    useProductMock.mockReturnValue({
      error: new Error('Product service unavailable'),
      isError: true,
      isLoading: false,
      isSuccess: false,
      product: null,
      retry,
    })

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Product service unavailable',
    )
    expect(retry).toHaveBeenCalledOnce()
  })

  it('uses a safe name when product naming data is missing', () => {
    useProductMock.mockReturnValue({
      error: null,
      isError: false,
      isLoading: false,
      isSuccess: true,
      product: {
        brand: '',
        colors: [],
        id: 'unnamed',
        imageUrl: null,
        model: '',
        price: null,
        primaryCamera: [],
        secondaryCamera: [],
        storageOptions: [],
      },
      retry: vi.fn(),
    })

    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Unnamed product' }),
    ).toBeInTheDocument()
  })
})
