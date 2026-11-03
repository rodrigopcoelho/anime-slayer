import { Logo } from './Logo.jsx'

const link = 'text-night-300 underline decoration-white/20 underline-offset-4 transition hover:text-night-100 hover:decoration-fuji'

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-(--gutter) py-12 text-sm text-night-400">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo className="text-xl" />
          <p lang="ja" aria-hidden className="mt-2 font-display text-xs tracking-[0.35em] text-night-600">
            アニメスレイヤー
          </p>
        </div>
        <div className="max-w-xl space-y-2 leading-relaxed">
          <p>
            Anime data and trailers from the{' '}
            <a className={link} href="https://anilist.co" target="_blank" rel="noreferrer">
              AniList API
            </a>
            . Free films stream from{' '}
            <a className={link} href="https://commons.wikimedia.org" target="_blank" rel="noreferrer">
              Wikimedia Commons
            </a>{' '}
            and are public domain or Creative Commons — each one lists its license and credits.
          </p>
          <p>A fan project. Not affiliated with Netflix, AniList or the Wikimedia Foundation.</p>
        </div>
      </div>
    </footer>
  )
}
