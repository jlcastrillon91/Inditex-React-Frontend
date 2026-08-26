import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductGridSkeleton } from '@/features/products/components/ProductGridSkeleton'

describe('ProductGridSkeleton', () => {
  it('exposes an accessible loading state', () => {
    const { container } = render(<ProductGridSkeleton count={4} />)

    expect(screen.getByRole('status', { name: 'Loading products' })).toBeInTheDocument()
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4)
  })
})
