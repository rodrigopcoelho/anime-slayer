import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/format.js'
import { Logo } from './Logo.jsx'

const SECTIONS = [
  { id: 'free', label: 'Free to watch' },
  { id: 'trending', label: 'Trending' },
  { id: 'season', label: 'This season' },
  { id: 'top', label: 'Top rated' },
]

function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

export function Navbar({ query, onQueryChange, solid, onNavigate, onHome }) {
  const scrolled = useScrolled()
  const opaque = solid || scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300',
        opaque
          ? 'border-white/5 bg-night-950/80 backdrop-blur-xl'
          : 'border-transparent bg-linear-to-b from-night-950/90 to-transparent',
      )}
    >
      <div className="flex h-16 items-center gap-4 px-(--gutter) sm:gap-10">
        <a
          href="/"
          onClick={(event) => {
            event.preventDefault()
            onHome()
          }}
          aria-label="Anime Slayer home"
          className="shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-fuji focus-visible:ring-offset-4 focus-visible:ring-offset-night-950"
        >
          <Logo />
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-7 text-sm text-night-300 lg:flex">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(section.id)
              }}
              className="rounded whitespace-nowrap outline-none transition-colors hover:text-night-100 focus-visible:text-night-100 focus-visible:ring-2 focus-visible:ring-fuji"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <SearchBar value={query} onChange={onQueryChange} className="ml-auto w-full max-w-xs sm:max-w-sm" />
      </div>
    </header>
  )
}

const isTyping = (element) =>
  element instanceof HTMLElement && (element.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(element.tagName))

function SearchBar({ value, onChange, className }) {
  const input = useRef(null)

  // Press "/" anywhere to jump into search, like most modern sites.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || isTyping(event.target)) return
      event.preventDefault()
      input.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(event) => {
        event.preventDefault()
        input.current?.blur()
      }}
    >
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-night-400" />
      <input
        ref={input}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            onChange('')
            event.currentTarget.blur()
          }
        }}
        placeholder="Search anime…"
        aria-label="Search anime"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        className="h-10 w-full rounded-full border border-white/10 bg-white/5 pr-10 pl-10 text-sm text-night-100 transition outline-none placeholder:text-night-400 hover:border-white/20 focus:border-fuji/60 focus:bg-night-900/90 focus:ring-4 focus:ring-fuji/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('')
            input.current?.focus()
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-full text-night-300 transition hover:bg-white/10 hover:text-night-100"
        >
          <X className="size-4" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-white/10 px-1.5 font-sans text-[11px] text-night-400 sm:block">
          /
        </kbd>
      )}
    </form>
  )
}
