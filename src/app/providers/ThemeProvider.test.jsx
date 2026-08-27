import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  ThemeProvider,
} from '@/app/providers/ThemeProvider'
import { defaultTheme } from '@/app/providers/theme'
import { useTheme } from '@/app/providers/useTheme'

function ThemeConsumer() {
  const theme = useTheme()

  return <output>{JSON.stringify(theme)}</output>
}

describe('ThemeProvider', () => {
  it('provides the default theme as CSS tokens and context', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    )

    const root = screen.getByText(JSON.stringify(defaultTheme)).parentElement

    expect(root).toHaveStyle({
      '--font-family': defaultTheme.font,
      '--primary': defaultTheme.primaryColor,
      '--secondary': defaultTheme.secondaryColor,
      fontFamily: 'var(--font-family)',
    })
  })

  it('merges configurable values with the defaults', () => {
    render(
      <ThemeProvider
        theme={{
          font: 'Georgia, serif',
          primaryColor: '#123456',
          secondaryColor: '#abcdef',
        }}
      >
        <ThemeConsumer />
      </ThemeProvider>,
    )

    expect(screen.getByText(/#123456/)).toHaveTextContent(
      JSON.stringify({
        font: 'Georgia, serif',
        primaryColor: '#123456',
        secondaryColor: '#abcdef',
      }),
    )
  })

  it('requires consumers to be inside the provider', () => {
    expect(() => render(<ThemeConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider.',
    )
  })
})
