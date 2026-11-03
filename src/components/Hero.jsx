import { Info, Play, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { cn, formatLabel, formatMinutes, formatScore } from '../lib/format.js'

const ACCENTS = ['var(--color-sakura)', 'var(--color-sora)', 'var(--color-fuji)', 'var(--color-matcha)', 'var(--color-yuzu)']

// Only Japanese (or other CJK) titles get the vertical treatment; "ONE PIECE" sideways looks broken.
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u

function toSlide(item, index, trendingRank) {
  const accent = ACCENTS[index % ACCENTS.length]
  if (item.kind === 'free') {
    return {
      item,
      accent: 'var(--color-matcha)',
      kickerJp: '無料',
      kicker: `Free to watch · ${item.license}`,
      vertical: item.jp ?? '無料上映',
      title: item.title,
      meta: [item.year, formatMinutes(item.duration), item.creator],
      description: item.blurb,
      backdrop: item.still,
      mobileBackdrop: item.still,
      primary: 'Play now',
    }
  }
  return {
    item,
    accent,
    kickerJp: '急上昇',
    kicker: `#${trendingRank} trending`,
    vertical: CJK.test(item.native ?? '') ? item.native : null,
    title: item.title,
    score: formatScore(item.score),
    meta: [item.year, formatLabel(item.format), item.episodes && `${item.episodes} episodes`],
    description: item.description,
    backdrop: item.banner,
    mobileBackdrop: item.coverXL,
    poster: item.coverXL,
    primary: item.trailerId ? 'Play trailer' : null,
  }
}

// Keeps long vertical titles inside the hero.
const verticalSize = (text = '') => `${Math.min(5.5, Math.max(2.25, 34 / [...text].length))}rem`

export function Hero({ items, onSelect, paused }) {
  const slides = useMemo(() => {
    let rank = 0
    return items.map((item, index) => toSlide(item, index, item.kind === 'anime' ? ++rank : rank))
  }, [items])
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const slide = slides[index % slides.length]
  const running = !paused && !hovered

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative isolate flex h-[80svh] min-h-[560px] items-end overflow-hidden sm:h-[88svh] sm:max-h-[880px]"
      style={{ '--accent': slide.accent }}
    >
      {/* Artwork + scrims, masked so the hero melts into the page instead of ending in a hard edge */}
      <div aria-hidden className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <AnimatePresence initial={false}>
          <motion.picture
            key={slide.item.key}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {slide.mobileBackdrop !== slide.backdrop && <source media="(max-width: 767px)" srcSet={slide.mobileBackdrop} />}
            <img
              src={slide.backdrop ?? slide.mobileBackdrop}
              alt=""
              fetchPriority="high"
              className={cn('size-full object-cover', slide.poster && 'md:scale-105 md:opacity-60 md:blur-[3px]')}
            />
          </motion.picture>
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-r from-night-950/95 via-night-950/60 to-night-950/5" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-night-950/90 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-night-950/80 to-transparent" />
        <div className="absolute top-1/2 -left-48 size-[36rem] -translate-y-1/2 rounded-full bg-(--accent) opacity-[0.12] blur-3xl transition-colors duration-1000" />
      </div>

      <div className="w-full px-(--gutter) pb-36 sm:pb-44">
        <div className="flex items-end justify-between gap-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.item.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl min-w-0"
            >
              <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.2em] text-(--accent) uppercase">
                <span lang="ja" className="font-display text-sm tracking-normal">
                  {slide.kickerJp}
                </span>
                <span aria-hidden className="h-px w-6 bg-current opacity-50" />
                {slide.kicker}
              </p>

              <h1 className="mt-3 line-clamp-3 font-display text-[clamp(2.1rem,5.2vw,4.5rem)] leading-[1.04] text-balance text-night-100">
                {slide.title}
              </h1>

              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-night-300">
                {slide.score && (
                  <span className="inline-flex items-center gap-1 font-semibold text-matcha">
                    <Star aria-hidden className="size-4 fill-current" />
                    <span className="sr-only">Score </span>
                    {slide.score}
                  </span>
                )}
                {slide.meta.filter(Boolean).map((part, i) => (
                  <span key={part} className="inline-flex items-center gap-3">
                    {(i > 0 || slide.score) && <span aria-hidden className="size-1 rounded-full bg-night-600" />}
                    {part}
                  </span>
                ))}
              </p>

              {slide.description && (
                <p className="mt-4 line-clamp-3 max-w-xl text-[0.95rem] leading-relaxed text-night-300 sm:text-base">
                  {slide.description}
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {slide.primary && (
                  <button
                    type="button"
                    onClick={() => onSelect(slide.item, { autoplay: true })}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-yuzu px-6 font-semibold text-night-950 shadow-[0_0_48px_-12px_var(--color-yuzu)] transition hover:bg-white focus-visible:ring-4 focus-visible:ring-yuzu/40 focus-visible:outline-none active:scale-[0.98]"
                  >
                    <Play aria-hidden className="size-5 fill-current" />
                    {slide.primary}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelect(slide.item)}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-6 font-semibold text-night-100 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/15 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-none active:scale-[0.98]"
                >
                  <Info aria-hidden className="size-5" />
                  More info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Poster + vertical Japanese title, like an anime key visual */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.item.key}
              aria-hidden
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden shrink-0 items-start gap-6 lg:flex"
            >
              {slide.vertical && (
                <span
                  lang="ja"
                  className="max-h-[22rem] overflow-hidden font-display leading-[1.05] text-outline writing-vertical"
                  style={{ fontSize: verticalSize(slide.vertical) }}
                >
                  {slide.vertical}
                </span>
              )}
              {slide.poster && (
                <img
                  src={slide.poster}
                  alt=""
                  className="w-[clamp(190px,16vw,260px)] rotate-2 rounded-3xl shadow-[0_40px_90px_-30px_var(--accent)] ring-1 ring-white/15"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <div className="mt-9 flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.item.key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${s.title}`}
                aria-current={i === index}
                className="group grid h-6 place-items-center outline-none"
              >
                <span className="relative block h-1 w-7 overflow-hidden rounded-full bg-white/15 transition group-hover:bg-white/30 group-focus-visible:ring-2 group-focus-visible:ring-fuji sm:w-11">
                  {i === index && (
                    <span
                      className="absolute inset-0 origin-left animate-hero-progress rounded-full bg-night-100 motion-reduce:animate-none"
                      style={{ animationPlayState: running ? 'running' : 'paused' }}
                      onAnimationEnd={() => setIndex((current) => (current + 1) % slides.length)}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function HeroSkeleton() {
  return (
    <div aria-hidden className="relative flex h-[80svh] min-h-[560px] items-end sm:h-[88svh] sm:max-h-[880px]">
      <div className="w-full px-(--gutter) pb-44">
        <div className="skeleton h-3 w-40 rounded-full" />
        <div className="skeleton mt-5 h-14 w-[min(36rem,80%)] rounded-2xl" />
        <div className="skeleton mt-4 h-4 w-60 rounded-full" />
        <div className="skeleton mt-6 h-4 w-[min(32rem,90%)] rounded-full" />
        <div className="skeleton mt-2 h-4 w-[min(28rem,80%)] rounded-full" />
        <div className="mt-8 flex gap-3">
          <div className="skeleton h-12 w-40 rounded-full" />
          <div className="skeleton h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  )
}
