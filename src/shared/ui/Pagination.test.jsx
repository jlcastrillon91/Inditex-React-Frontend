import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from '@/shared/ui/Pagination'

describe('Pagination', () => {
  it('does not render when all results fit on one page', () => {
    render(<Pagination currentPage={1} onPageChange={vi.fn()} pageCount={1} />)

    expect(
      screen.queryByRole('navigation', { name: 'Catalogue pagination' }),
    ).not.toBeInTheDocument()
  })

  it('marks the current page and disables unavailable navigation', () => {
    render(<Pagination currentPage={1} onPageChange={vi.fn()} pageCount={3} />)

    expect(screen.getByLabelText('Page 1, current page')).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled()
    expect(screen.getByLabelText('Go to next page')).toBeEnabled()
  })

  it('reports previous, numbered, and next page selections', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={2} onPageChange={onPageChange} pageCount={4} />,
    )

    fireEvent.click(screen.getByLabelText('Go to previous page'))
    fireEvent.click(screen.getByLabelText('Go to page 4'))
    fireEvent.click(screen.getByLabelText('Go to next page'))

    expect(onPageChange.mock.calls).toEqual([[1], [4], [3]])
  })
})
