import { useEffect, useState } from 'react'

// The search box text, mirrored to ?q= so results can be shared and survive a reload.
export function useSearchQuery() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')

  useEffect(() => {
    const url = new URL(window.location.href)
    if (query) url.searchParams.set('q', query)
    else url.searchParams.delete('q')
    window.history.replaceState(null, '', url)
  }, [query])

  return [query, setQuery]
}

// Waits for typing to pause, but clears instantly so going back home feels snappy.
export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), value ? delay : 0)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
