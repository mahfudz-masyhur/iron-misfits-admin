'use client'
import { useEffect, useState } from 'react'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints: Record<Breakpoint, string> = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)'
}

const useMediaQuery = (breakpoint: Breakpoint): boolean => {
  const mediaQuery = window.matchMedia(breakpoints[breakpoint])
  const [matches, setMatches] = useState(mediaQuery.matches)

  const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
  
  useEffect(() => {
    setMatches(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [breakpoint, mediaQuery])

  return matches
}

export default useMediaQuery
