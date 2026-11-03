import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../lib/format.js'
import { AnimeCard, CardSkeleton, FreeCard, RankedCard } from './Cards.jsx'
import { ErrorNotice } from './Notice.jsx'

const WIDTHS = {
  poster: 'w-[38vw] max-w-48 shrink-0 sm:w-40 lg:w-44 xl:w-48',
  landscape: 'w-[72vw] max-w-80 shrink-0 sm:w-64 lg:w-72 xl:w-80',
}

export function Row({ id, kicker, title, note, accent, variant = 'poster', items, query, onSelect }) {
  const scroller = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  const updateEdges = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateEdges, items])

  const scrollPage = (direction) => {
    const el = scroller.current
    el.scrollBy({ left: direction * el.clientWidth * 0.8 })
  }

  if (query.isSuccess && !items?.length) return null

  const width = WIDTHS[variant === 'landscape' ? 'landscape' : 'poster']

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="group/row relative scroll-mt-16 py-3 sm:py-4" style={{ '--accent': accent }}>
      <div className="flex items-baseline gap-3 px-(--gutter)">
        <span aria-hidden lang="ja" className="font-display text-sm text-(--accent)">
          {kicker}
        </span>
        <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight text-night-100 sm:text-xl">
          {title}
        </h2>
        {note && <span className="hidden truncate text-sm text-night-400 sm:inline">{note}</span>}
      </div>

      {query.isError ? (
        <div className="px-(--gutter) pt-3">
          <ErrorNotice query={query} className="py-8" />
        </div>
      ) : (
        <div className="relative">
          <div
            ref={scroller}
            onScroll={updateEdges}
            className="no-scrollbar flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto overscroll-x-contain px-(--gutter) pt-3 pb-5 motion-safe:scroll-smooth sm:gap-4"
          >
            {query.isPending
              ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} variant={variant} className={width} />)
              : items.map((item, index) => {
                  if (variant === 'landscape') return <FreeCard key={item.key} film={item} onSelect={onSelect} className={width} />
                  if (variant === 'ranked') return <RankedCard key={item.key} anime={item} rank={index + 1} onSelect={onSelect} />
                  return <AnimeCard key={item.key} anime={item} onSelect={onSelect} className={width} />
                })}
          </div>
          <ScrollButton side="left" hidden={edges.start} label={`Scroll ${title} back`} onClick={() => scrollPage(-1)} />
          <ScrollButton side="right" hidden={edges.end} label={`Scroll ${title} forward`} onClick={() => scrollPage(1)} />
        </div>
      )}
    </section>
  )
}

function ScrollButton({ side, hidden, label, onClick }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      tabIndex={-1}
      className={cn(
        'absolute inset-y-0 z-10 hidden w-(--gutter) min-w-14 items-center justify-center from-night-950/90 to-transparent opacity-0 transition-opacity duration-300 md:flex',
        side === 'left' ? 'left-0 bg-linear-to-r' : 'right-0 bg-linear-to-l',
        hidden ? 'pointer-events-none' : 'group-hover/row:opacity-100',
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-night-900/80 text-night-100 ring-1 ring-white/15 backdrop-blur transition hover:scale-110 hover:bg-night-800">
        <Icon className="size-5" />
      </span>
    </button>
  )
}
