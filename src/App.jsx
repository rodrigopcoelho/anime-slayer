import { useCallback, useEffect, useRef, useState } from 'react'
import { DetailDialog } from './components/DetailDialog.jsx'
import { Footer } from './components/Footer.jsx'
import { Home } from './components/Home.jsx'
import { Navbar } from './components/Navbar.jsx'
import { SearchResults } from './components/SearchResults.jsx'
import { useFreeFilms } from './hooks/queries.js'
import { useDebouncedValue, useSearchQuery } from './hooks/useSearchQuery.js'

export default function App() {
  const [query, setQuery] = useSearchQuery()
  const term = useDebouncedValue(query.trim())
  const searching = term.length >= 2
  const [selection, setSelection] = useState(null)
  const free = useFreeFilms()
  const pendingSection = useRef(null)

  const select = useCallback((item, { autoplay = false } = {}) => setSelection({ item, autoplay }), [])

  // Entering or leaving search starts at the top, unless a nav link asked for a section.
  // Both jumps are instant: the whole page was just swapped, so there is nothing to glide past.
  useEffect(() => {
    const target = !searching && pendingSection.current && document.getElementById(pendingSection.current)
    pendingSection.current = null
    if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [searching])

  useEffect(() => {
    document.title = searching ? `“${term}” · Anime Slayer` : 'Anime Slayer'
  }, [searching, term])

  const goToSection = (id) => {
    if (!searching) return document.getElementById(id)?.scrollIntoView({ block: 'start' })
    pendingSection.current = id
    setQuery('')
  }

  const goHome = () => {
    setQuery('')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="atmosphere flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-yuzu px-4 py-2 font-semibold text-night-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar query={query} onQueryChange={setQuery} solid={searching} onNavigate={goToSection} onHome={goHome} />
      <main id="main" className="flex-1">
        {searching ? (
          <SearchResults term={term} freeFilms={free.data} onSelect={select} />
        ) : (
          <Home onSelect={select} heroPaused={selection !== null} />
        )}
      </main>
      <Footer />
      <DetailDialog selection={selection} onClose={() => setSelection(null)} />
    </div>
  )
}
