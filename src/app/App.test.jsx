import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { Header } from '@/app/layouts/Header'

describe('application shell', () => {
  it('renders the home link', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /mobile store/i })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
