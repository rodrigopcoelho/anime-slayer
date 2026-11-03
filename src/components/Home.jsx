import { useMemo } from 'react'
import { useFreeFilms, useHomeRows } from '../hooks/queries.js'
import { currentSeason, seasonInfo } from '../lib/format.js'
import { Hero, HeroSkeleton } from './Hero.jsx'
import { Row } from './Row.jsx'

export function Home({ onSelect, heroPaused }) {
  const home = useHomeRows()
  const free = useFreeFilms()
  const season = currentSeason()
  const seasonMeta = seasonInfo(season.season)
  const freeIn = (section) => free.data?.filter((film) => film.section === section)

  // Free films lead the carousel, interleaved with what's trending right now.
  const heroItems = useMemo(() => {
    const [first, second] = free.data?.filter((film) => film.featured) ?? []
    const trending = (home.data?.trending ?? []).filter((anime) => anime.banner && anime.description).slice(0, 4)
    return [first, ...trending.slice(0, 2), second, ...trending.slice(2)].filter(Boolean)
  }, [home.data, free.data])

  const heroReady = !home.isPending && !free.isPending

  return (
    <>
      {!heroReady ? (
        <HeroSkeleton />
      ) : heroItems.length ? (
        <Hero items={heroItems} onSelect={onSelect} paused={heroPaused} />
      ) : (
        <div className="h-40" />
      )}

      <div className="relative z-10 -mt-28 space-y-1 pb-10 sm:-mt-36">
        <Row
          id="free"
          kicker="無料"
          title="Free to watch"
          note="Creative Commons anime, streamed in full"
          accent="var(--color-matcha)"
          variant="landscape"
          query={free}
          items={freeIn('cc')}
          onSelect={onSelect}
        />
        <Row
          id="trending"
          kicker="急上昇"
          title="Top 10 trending"
          accent="var(--color-sakura)"
          variant="ranked"
          query={home}
          items={home.data?.trending.slice(0, 10)}
          onSelect={onSelect}
        />
        <Row
          id="season"
          kicker={`${seasonMeta.kanji}アニメ`}
          title={`${seasonMeta.label} ${season.year} season`}
          accent="var(--color-sora)"
          query={home}
          items={home.data?.season}
          onSelect={onSelect}
        />
        <Row
          id="classics"
          kicker="白黒"
          title="Silent-era classics"
          note="Public domain · 1917–1929"
          accent="var(--color-yuzu)"
          variant="landscape"
          query={free}
          items={freeIn('silent')}
          onSelect={onSelect}
        />
        <Row
          id="popular"
          kicker="人気"
          title="All-time popular"
          accent="var(--color-fuji)"
          query={home}
          items={home.data?.popular}
          onSelect={onSelect}
        />
        <Row
          id="top"
          kicker="高評価"
          title="Top rated"
          accent="var(--color-matcha)"
          query={home}
          items={home.data?.top}
          onSelect={onSelect}
        />
        <Row
          id="prewar"
          kicker="昭和"
          title="Prewar shorts"
          note="Public domain · 1930–1941"
          accent="var(--color-sora)"
          variant="landscape"
          query={free}
          items={freeIn('prewar')}
          onSelect={onSelect}
        />
        <Row
          id="movies"
          kicker="劇場版"
          title="Movies"
          accent="var(--color-sakura)"
          query={home}
          items={home.data?.movies}
          onSelect={onSelect}
        />
      </div>
    </>
  )
}
