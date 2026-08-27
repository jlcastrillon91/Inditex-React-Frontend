import { useMemo } from 'react'

import { ThemeContext } from '@/app/providers/ThemeContext'
import { defaultTheme } from '@/app/providers/theme'

export function ThemeProvider({ children, theme = {} }) {
  const value = useMemo(
    () => Object.freeze({ ...defaultTheme, ...theme }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div
        className="min-h-svh"
        data-theme="application"
        style={{
          '--font-family': value.font,
          '--primary': value.primaryColor,
          '--secondary': value.secondaryColor,
          fontFamily: 'var(--font-family)',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
