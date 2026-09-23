import { useCallback, useEffect, useState } from 'react'

const KEY = 'nt.theme'

/** Day in the forest is the default; night is the same wood after dark,
 *  remembered per browser. */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1510' : '#f2efe2')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* private mode — the toggle still works for this session */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle]
}

/** Matches a media query and stays subscribed. */
export function useMedia(query, initial = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return initial
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])

  return matches
}
