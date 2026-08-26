import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductDetailImage } from '@/features/products/components/ProductDetailImage'

describe('ProductDetailImage', () => {
  it('renders an eager high-priority product image', () => {
    render(
      <ProductDetailImage
        imageUrl="https://example.com/phone.jpg"
        productName="Samsung Galaxy S24"
      />,
    )

    const image = screen.getByRole('img', { name: 'Samsung Galaxy S24' })
    expect(image).toHaveAttribute('src', 'https://example.com/phone.jpg')
    expect(image).toHaveAttribute('fetchpriority', 'high')
    expect(image).not.toHaveAttribute('loading')
    expect(image).toHaveAttribute('width', '640')
    expect(image).toHaveAttribute('height', '640')
  })

  it('shows a fallback when no image is available', () => {
    render(
      <ProductDetailImage imageUrl={null} productName="Samsung Galaxy S24" />,
    )

    expect(
      screen.getByRole('img', {
        name: 'Samsung Galaxy S24 image unavailable',
      }),
    ).toBeInTheDocument()
  })

  it('replaces an image that fails to load', () => {
    render(
      <ProductDetailImage
        imageUrl="https://example.com/broken.jpg"
        productName="Samsung Galaxy S24"
      />,
    )

    fireEvent.error(screen.getByRole('img', { name: 'Samsung Galaxy S24' }))

    expect(
      screen.getByRole('img', {
        name: 'Samsung Galaxy S24 image unavailable',
      }),
    ).toBeInTheDocument()
  })
})
