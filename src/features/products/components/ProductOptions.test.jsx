import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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
  })

  it('allows local option selection without cart behavior', () => {
    render(
      <ProductOptions
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
    expect(screen.queryByRole('button', { name: /add/i })).not.toBeInTheDocument()
  })

  it('keeps unavailable selectors visible and disabled', () => {
    render(<ProductOptions colors={[]} storageOptions={[]} />)

    expect(screen.getByRole('combobox', { name: 'Storage' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Color' })).toBeDisabled()
    expect(screen.getAllByRole('option', { name: 'Not available' })).toHaveLength(2)
  })
})
