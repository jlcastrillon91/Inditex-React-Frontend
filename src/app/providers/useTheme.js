import { useContext } from 'react'

import { ThemeContext } from '@/app/providers/ThemeContext'

export function useTheme() {
  const theme = useContext(ThemeContext)

  if (theme === null) {
    throw new Error('useTheme must be used within a ThemeProvider.')
  }

  return theme
}
