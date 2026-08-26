import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductPrice } from '@/features/products/components/ProductPrice'

describe('ProductPrice', () => {
  it('formats an available price', () => {
    render(<ProductPrice value={230} />)

    expect(screen.getByText('€230.00')).toBeInTheDocument()
  })

  it.each([null, undefined, ''])('renders a visual pending state for %s', (value) => {
    render(<ProductPrice value={value} />)

    expect(screen.getByText('Price pending')).toBeInTheDocument()
  })
})
