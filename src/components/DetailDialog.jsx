import * as Dialog from '@radix-ui/react-dialog'
import { ExternalLink, Play, Star, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { FREE_SECTIONS } from '../data/freeAnime.js'
import { cn, formatLabel, formatMinutes, formatScore, seasonInfo, statusLabel, timeUntil } from '../lib/format.js'

export function DetailDialog({ selection, onClose }) {
  const open = Boolean(selection)

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-night-950/75 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="pointer-events-auto relative max-h-[94dvh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-t-3xl bg-night-900 shadow-2xl shadow-black/60 ring-1 ring-white/10 outline-none sm:max-h-[calc(100dvh-3rem)] sm:rounded-3xl"
                  initial={{ opacity: 0, y: 48, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 32, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                >
                  {selection.item.kind === 'free' ? (
                    <FreeFilmDetails key={selection.item.key} film={selection.item} autoplay={selection.autoplay} />
                  ) : (
                    <AnimeDetails key={selection.item.key} anime={selection.item} autoplay={selection.autoplay} />
                  )}
                  <Dialog.Close
                    aria-label="Close"
                    className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full bg-night-950/70 text-night-100 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-night-950 focus-visible:ring-2 focus-visible:ring-fuji focus-visible:outline-none"
                  >
                    <X className="size-5" />
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function Kicker({ jp, children }) {
  return (
    <p className="flex flex-wrap items-center gap-2.5 text-xs font-semibold tracking-[0.18em] text-(--accent) uppercase">
      <span lang="ja" className="font-display text-sm tracking-normal">
        {jp}
      </span>
      <span aria-hidden className="h-px w-5 bg-current opacity-50" />
      {children}
    </p>
  )
}

function Facts({ items }) {
  const facts = items.filter(([, value]) => value)
  if (!facts.length) return null
  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl bg-white/[0.03] p-4 text-sm ring-1 ring-white/[0.06] sm:grid-cols-3">
      {facts.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-night-400">{label}</dt>
          <dd className="mt-0.5 break-words whitespace-pre-line text-night-100">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const linkButton =
  'inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold text-night-100 ring-1 ring-white/15 transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-fuji focus-visible:outline-none'

function AnimeDetails({ anime, autoplay }) {
  const [playing, setPlaying] = useState(autoplay && Boolean(anime.trailerId))
  const score = formatScore(anime.score)
  const season = seasonInfo(anime.season)
  const status = statusLabel(anime.status)

  return (
    <article style={{ '--accent': 'var(--color-sakura)' }}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-night-950 sm:rounded-t-3xl',
          playing ? 'aspect-video' : 'aspect-[16/9] sm:aspect-[21/9]',
        )}
      >
        {playing ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${anime.trailerId}?autoplay=1&rel=0&playsinline=1`}
            title={`${anime.title} — trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={anime.banner ?? anime.coverXL}
              alt=""
              className={cn('absolute inset-0 size-full object-cover', !anime.banner && 'scale-110 opacity-60 blur-2xl')}
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night-900 via-night-900/30 to-transparent" />
            {anime.trailerId && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 grid place-items-center outline-none"
                aria-label={`Play the ${anime.title} trailer`}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-yuzu px-5 py-3 font-semibold text-night-950 shadow-xl shadow-black/40 transition group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-yuzu/40">
                  <Play aria-hidden className="size-5 fill-current" />
                  Play trailer
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-[10rem_1fr] sm:gap-8 sm:p-8">
        <img
          src={anime.coverXL}
          alt=""
          className="hidden w-40 rounded-2xl shadow-xl shadow-black/40 ring-1 ring-white/10 sm:block"
        />
        <div className="min-w-0">
          <Kicker jp={season?.kanji ? `${season.kanji}アニメ` : 'アニメ'}>
            {[formatLabel(anime.format), anime.year].filter(Boolean).join(' · ') || 'Anime'}
          </Kicker>
          <Dialog.Title className="mt-2 font-display text-2xl leading-tight text-balance text-night-100 sm:text-4xl">
            {anime.title}
          </Dialog.Title>
          {anime.native && (
            <p lang="ja" className="mt-1.5 text-sm text-night-400">
              {anime.native}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {score && (
              <span className="inline-flex items-center gap-1 rounded-full bg-matcha/10 px-3 py-1 font-semibold text-matcha ring-1 ring-matcha/25">
                <Star aria-hidden className="size-3.5 fill-current" />
                <span className="sr-only">Score </span>
                {score}
              </span>
            )}
            {status && (
              <span
                className={cn(
                  'rounded-full px-3 py-1 font-medium ring-1',
                  anime.status === 'RELEASING'
                    ? 'bg-sakura/10 text-sakura ring-sakura/25'
                    : 'bg-white/5 text-night-300 ring-white/10',
                )}
              >
                {status}
              </span>
            )}
            {anime.genres.map((genre) => (
              <span key={genre} className="rounded-full bg-white/5 px-3 py-1 text-night-300 ring-1 ring-white/10">
                {genre}
              </span>
            ))}
          </div>

          <p className="mt-5 text-[0.95rem] leading-relaxed whitespace-pre-line text-night-300">
            {anime.description || 'No synopsis yet.'}
          </p>

          <Facts
            items={[
              ['Format', formatLabel(anime.format)],
              ['Episodes', anime.episodes],
              ['Episode length', anime.duration && `${anime.duration} min`],
              ['Season', season && anime.year ? `${season.label} ${anime.year}` : anime.year],
              ['Studio', anime.studio],
              [
                'Next episode',
                anime.nextEpisode && `Ep ${anime.nextEpisode.episode} · ${timeUntil(anime.nextEpisode.airingAt)}`,
              ],
            ]}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={anime.url} target="_blank" rel="noreferrer" className={linkButton}>
              View on AniList
              <ExternalLink aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

// Phones get a lighter stream; everything prefers WebM, then the MP4/MOV fallback.
function pickSources(sources) {
  const maxHeight = window.matchMedia('(max-width: 767px)').matches ? 480 : 1080
  const fitting = sources.filter((source) => !source.height || source.height <= maxHeight)
  return (fitting.length ? fitting : sources).toSorted((a, b) => a.rank - b.rank || b.height - a.height)
}

function FreeFilmDetails({ film, autoplay }) {
  const sources = useMemo(() => pickSources(film.sources), [film])
  const license = film.licenseUrl ? (
    <a
      href={film.licenseUrl}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-matcha/40 underline-offset-4 hover:decoration-matcha"
    >
      {film.license}
    </a>
  ) : (
    film.license
  )

  return (
    <article style={{ '--accent': 'var(--color-matcha)' }}>
      <div className="relative aspect-video w-full overflow-hidden bg-black sm:rounded-t-3xl">
        <video
          className="absolute inset-0 size-full"
          controls
          autoPlay={autoplay}
          playsInline
          preload="metadata"
          poster={film.still ?? undefined}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          Your browser can’t play this video — <a href={film.pageUrl}>watch it on Wikimedia Commons</a>.
        </video>
      </div>

      <div className="p-5 sm:p-8">
        <Kicker jp="無料">Free to watch · {film.license}</Kicker>
        <Dialog.Title className="mt-2 font-display text-2xl leading-tight text-balance text-night-100 sm:text-4xl">
          {film.title}
        </Dialog.Title>
        {film.jp && (
          <p lang="ja" className="mt-1.5 text-sm text-night-400">
            {film.jp}
          </p>
        )}
        <p className="mt-3 text-sm text-night-300">
          {[film.creator, film.year, formatMinutes(film.duration)].filter(Boolean).join(' · ')}
        </p>
        <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-night-300">
          {film.blurb ?? FREE_SECTIONS[film.section].about}
        </p>

        <Facts
          items={[
            ['License', license],
            ['Credit', film.credit],
            ['Source', 'Wikimedia Commons'],
          ]}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={film.pageUrl} target="_blank" rel="noreferrer" className={linkButton}>
            View on Wikimedia Commons
            <ExternalLink aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </article>
  )
}
