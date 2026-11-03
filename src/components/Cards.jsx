import { Play, Star } from 'lucide-react'
import { cn, formatDuration, formatLabel, formatMinutes, formatScore } from '../lib/format.js'

// Black-and-white classics get a palette tint: cream for the silent era, icy blue (cyanotype) for prewar.
const TINTS = { silent: 'var(--color-yuzu)', prewar: 'var(--color-sora)' }

const frame =
  'relative overflow-hidden rounded-2xl bg-night-800 shadow-lg shadow-black/30 ring-1 ring-white/[0.06] transition duration-300 ease-out group-hover/card:ring-2 group-hover/card:ring-(--accent) group-focus-visible/card:ring-2 group-focus-visible/card:ring-(--accent) motion-safe:group-hover/card:-translate-y-1.5'

const image = 'size-full object-cover transition duration-500 ease-out motion-safe:group-hover/card:scale-[1.04]'

function CardText({ title, meta }) {
  return (
    <>
      <h3 className="mt-2.5 line-clamp-2 text-sm leading-snug font-medium text-night-100 transition-colors group-hover/card:text-(--accent)">
        {title}
      </h3>
      {meta && <p className="mt-1 truncate text-xs text-night-400">{meta}</p>}
    </>
  )
}

export function AnimeCard({ anime, onSelect, className, sizes = '(min-width: 1280px) 192px, (min-width: 640px) 176px, 40vw' }) {
  const score = formatScore(anime.score)
  const meta = [anime.year, formatLabel(anime.format)].filter(Boolean).join(' · ')
  return (
    <button
      type="button"
      onClick={() => onSelect(anime)}
      aria-label={[anime.title, meta, score && `score ${score}`].filter(Boolean).join(', ')}
      className={cn('group/card block snap-start text-left outline-none', className)}
    >
      <div className={cn(frame, 'aspect-[2/3]')}>
        <img
          src={anime.cover}
          srcSet={`${anime.cover} 230w, ${anime.coverXL} 460w`}
          sizes={sizes}
          alt=""
          loading="lazy"
          decoding="async"
          className={image}
        />
        {score && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-night-950/70 px-2 py-0.5 text-[11px] font-semibold text-matcha ring-1 ring-white/10 backdrop-blur-md">
            <Star aria-hidden className="size-3 fill-current" />
            {score}
          </span>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-(--accent)/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover/card:opacity-100"
        />
      </div>
      <CardText title={anime.title} meta={meta} />
    </button>
  )
}

// Netflix-style "Top 10" card: an outlined rank number tucked behind the poster.
export function RankedCard({ anime, rank, onSelect }) {
  return (
    <div className={cn('relative flex shrink-0 snap-start items-start', rank < 10 ? 'pl-9 sm:pl-12' : 'pl-16 sm:pl-24')}>
      <span
        aria-hidden
        className="absolute top-0 left-0 font-display text-[6.5rem] leading-[0.9] text-transparent [-webkit-text-stroke:2px_var(--accent)] select-none sm:text-[8.5rem]"
      >
        {rank}
      </span>
      <AnimeCard anime={anime} onSelect={onSelect} className="relative w-[34vw] max-w-44 sm:w-40 lg:w-44" />
    </div>
  )
}

export function FreeCard({ film, onSelect, className }) {
  const tint = TINTS[film.section]
  const duration = formatDuration(film.duration)
  const meta = [film.creator, film.year].filter(Boolean).join(' · ')
  return (
    <button
      type="button"
      onClick={() => onSelect(film, { autoplay: true })}
      aria-label={[`Play ${film.title}`, meta, 'free', formatMinutes(film.duration)].filter(Boolean).join(', ')}
      className={cn('group/card block snap-start text-left outline-none', className)}
    >
      <div className={cn(frame, 'isolate aspect-video')} style={tint && { '--tint': tint }}>
        {film.thumb && (
          <img
            src={film.thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className={cn(image, tint && 'contrast-110 grayscale')}
          />
        )}
        {/* The tint fades away on hover to reveal the original frame */}
        {tint && (
          <div
            aria-hidden
            className="absolute inset-0 bg-(--tint) opacity-60 mix-blend-color transition-opacity duration-500 group-hover/card:opacity-0"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-night-950/80 via-transparent to-transparent" />
        <span className="absolute top-2 left-2 rounded-full bg-matcha px-2 py-0.5 text-[10px] font-bold tracking-wider text-night-950 uppercase">
          Free
        </span>
        {duration && (
          <span className="absolute right-2 bottom-2 rounded-md bg-night-950/70 px-1.5 py-0.5 text-[11px] font-medium text-night-100 tabular-nums backdrop-blur-md">
            {duration}
          </span>
        )}
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center opacity-0 transition duration-300 group-hover/card:opacity-100 group-focus-visible/card:opacity-100"
        >
          <span className="grid size-12 place-items-center rounded-full bg-yuzu text-night-950 shadow-xl shadow-black/40 transition duration-300 motion-safe:scale-90 motion-safe:group-hover/card:scale-100">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        </span>
      </div>
      <CardText title={film.title} meta={meta} />
    </button>
  )
}

export function CardSkeleton({ variant = 'poster', className }) {
  return (
    <div aria-hidden className={cn('shrink-0', className)}>
      <div className={cn('skeleton rounded-2xl', variant === 'landscape' ? 'aspect-video' : 'aspect-[2/3]')} />
      <div className="skeleton mt-3 h-3.5 w-4/5 rounded-full" />
      <div className="skeleton mt-2 h-3 w-1/2 rounded-full" />
    </div>
  )
}
