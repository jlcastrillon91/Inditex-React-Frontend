import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductSearch } from '@/features/products/components/ProductSearch'

describe('ProductSearch', () => {
  it('reports search input changes', () => {
    const onSearchChange = vi.fn()
    render(
      <ProductSearch
        onSearchChange={onSearchChange}
        search=""
      />,
    )

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search products by brand or model' }),
      { target: { value: 'Acer' } },
    )

    expect(onSearchChange).toHaveBeenCalledWith('Acer')
  })

  it('clears a populated search', () => {
    const onSearchChange = vi.fn()
    render(
      <ProductSearch onSearchChange={onSearchChange} search="Acer" />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear product search' }))

    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('supports a disabled loading state', () => {
    render(<ProductSearch disabled onSearchChange={vi.fn()} search="" />)

    expect(screen.getByRole('searchbox')).toBeDisabled()
  })
})
