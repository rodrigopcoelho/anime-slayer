import { LoaderCircle } from 'lucide-react'
import { useMemo } from 'react'
import { useAnimeSearch } from '../hooks/queries.js'
import { cn, fold } from '../lib/format.js'
import { AnimeCard, CardSkeleton, FreeCard } from './Cards.jsx'
import { ErrorNotice, Notice } from './Notice.jsx'

const POSTER_GRID = 'grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
const POSTER_SIZES = '(min-width: 1536px) 14vw, (min-width: 1280px) 16vw, (min-width: 1024px) 19vw, (min-width: 768px) 24vw, (min-width: 640px) 31vw, 47vw'

function matchFree(films, term) {
  const needle = fold(term)
  return films.filter((film) => {
    const kind = film.section === 'cc' ? 'creative commons' : 'public domain classic'
    return fold(`${film.title} ${film.jp ?? ''} ${film.creator} ${film.year ?? ''} free ${kind}`).includes(needle)
  })
}

export function SearchResults({ term, freeFilms, onSelect }) {
  const search = useAnimeSearch(term)
  const free = useMemo(() => matchFree(freeFilms ?? [], term), [freeFilms, term])
  const anime = useMemo(() => {
    const unique = new Map()
    for (const page of search.data?.pages ?? []) for (const item of page.media) unique.set(item.id, item)
    return [...unique.values()]
  }, [search.data])

  return (
    <section aria-labelledby="results-title" className="px-(--gutter) pt-24 pb-20 sm:pt-28">
      <p lang="ja" aria-hidden className="font-display text-sm text-sakura">
        検索
      </p>
      <h1 id="results-title" className="mt-1 text-2xl font-semibold tracking-tight text-night-100 sm:text-3xl">
        Results for “<span className="text-yuzu">{term}</span>”
      </h1>

      {free.length > 0 && (
        <div className="mt-8" style={{ '--accent': 'var(--color-matcha)' }}>
          <h2 className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-matcha uppercase">
            <span lang="ja" className="font-display text-sm tracking-normal">
              無料
            </span>
            Free to watch
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {free.map((film) => (
              <FreeCard key={film.key} film={film} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10" style={{ '--accent': 'var(--color-sakura)' }}>
        {free.length > 0 && (
          <h2 className="mb-4 flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-sakura uppercase">
            <span lang="ja" className="font-display text-sm tracking-normal">
              アニメ
            </span>
            Anime
          </h2>
        )}

        {search.isPending ? (
          <div className={POSTER_GRID}>
            {Array.from({ length: 14 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : search.isError ? (
          <ErrorNotice query={search} />
        ) : anime.length === 0 ? (
          <Notice face="(・_・;)" title={`No anime found for “${term}”`}>
            Try the original Japanese title, a shorter keyword — or search “free” to see everything you can watch right here.
          </Notice>
        ) : (
          <>
            <div
              aria-busy={search.isPlaceholderData}
              className={cn(POSTER_GRID, 'transition-opacity duration-300', search.isPlaceholderData && 'opacity-50')}
            >
              {anime.map((item) => (
                <AnimeCard key={item.key} anime={item} onSelect={onSelect} sizes={POSTER_SIZES} />
              ))}
            </div>
            {search.hasNextPage && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => search.fetchNextPage()}
                  disabled={search.isFetchingNextPage}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-6 text-sm font-semibold text-night-100 ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-60"
                >
                  {search.isFetchingNextPage && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
