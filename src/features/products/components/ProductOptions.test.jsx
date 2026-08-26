import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductOptions } from '@/features/products/components/ProductOptions'

describe('ProductOptions', () => {
  it('shows both selectors and defaults to the first options', () => {
    render(
      <ProductOptions
        colors={[
          { code: 1, name: 'Black' },
          { code: 2, name: 'Silver' },
        ]}
        storageOptions={[
          { code: 10, name: '128 GB' },
          { code: 20, name: '256 GB' },
        ]}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Storage' })).toHaveValue('10')
    expect(screen.getByRole('combobox', { name: 'Color' })).toHaveValue('1')
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeEnabled()
  })

  it('submits the selected option codes using their original types', () => {
    const onSubmit = vi.fn().mockResolvedValue(1)
    render(
      <ProductOptions
        action={{ onSubmit }}
        colors={[
          { code: 1, name: 'Black' },
          { code: 2, name: 'Silver' },
        ]}
        storageOptions={[{ code: 10, name: '128 GB' }]}
      />,
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Color' }), {
      target: { value: '2' },
    })

    expect(screen.getByRole('combobox', { name: 'Color' })).toHaveValue('2')
    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }))

    expect(onSubmit).toHaveBeenCalledWith({
      colorCode: 2,
      storageCode: 10,
    })
  })

  it('keeps unavailable selectors visible and disabled', () => {
    render(<ProductOptions colors={[]} storageOptions={[]} />)

    expect(screen.getByRole('combobox', { name: 'Storage' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Color' })).toBeDisabled()
    expect(screen.getAllByRole('option', { name: 'Not available' })).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled()
  })

  it('allows products without storage and submits an empty storage code', () => {
    const onSubmit = vi.fn().mockResolvedValue(1)

    render(
      <ProductOptions
        action={{ onSubmit }}
        colors={[{ code: 1, name: 'Black' }]}
        storageOptions={[]}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Storage' })).toBeDisabled()
    expect(screen.getByRole('option', { name: 'Not available' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }))

    expect(onSubmit).toHaveBeenCalledWith({
      colorCode: 1,
      storageCode: '',
    })
  })

  it('disables controls and communicates a pending request', () => {
    render(
      <ProductOptions
        action={{ isPending: true }}
        colors={[{ code: 1, name: 'Black' }]}
        storageOptions={[{ code: 10, name: '128 GB' }]}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Storage' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Color' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Adding…' })).toBeDisabled()
  })

  it('renders accessible success and error feedback', () => {
    const { rerender } = render(
      <ProductOptions
        action={{ isSuccess: true }}
        colors={[{ code: 1, name: 'Black' }]}
        storageOptions={[{ code: 10, name: '128 GB' }]}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Product added to cart.',
    )

    rerender(
      <ProductOptions
        action={{ error: new Error('Cart unavailable') }}
        colors={[{ code: 1, name: 'Black' }]}
        storageOptions={[{ code: 10, name: '128 GB' }]}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Cart unavailable')
  })
})
