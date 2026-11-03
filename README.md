# anime / slayer

**アニメスレイヤー** — a minimalist, Netflix-style anime catalog built with React.

Search any anime, browse trending, seasonal and top-rated rows, watch official trailers, and stream
**public-domain and Creative Commons anime in full**, legally and for free. No login, no tracking, no API keys.

## Features

- **Hero carousel** that mixes free films with what's trending. It auto-advances, pauses on hover, and stays still for reduced-motion users.
- **Netflix-style rows**: Free to watch, Top 10 trending, This season, Silent-era classics (1917–1929), All-time popular, Top rated, Prewar shorts (1930–1941), and Movies.
- **Search** across both sources, with debounced input, shareable `?q=` URLs and "Load more" pagination. Searching `free` lists every film you can stream.
- **Detail dialog** with synopsis, score, genres, studio, a next-episode countdown and the official YouTube trailer.
- **In-app player** for free films, with WebM streams from Wikimedia Commons and each film's license and credits.
- **Responsive and accessible**: swipeable rows, a bottom-sheet dialog on phones, `/` to focus search, `Esc` to close, plus loading skeletons and error states with retry.

## Where the anime comes from

| Source | Used for | Notes |
| --- | --- | --- |
| [AniList GraphQL API](https://docs.anilist.co) | Catalog, search, trailers | Free, no key, non-commercial use. The whole home page is **one** request, well under the rate limit. |
| [Wikimedia Commons API](https://commons.wikimedia.org/w/api.php) | Free films: thumbnails, video streams, licenses | Every film is public domain or Creative Commons. The hand-picked list lives in [`src/data/freeAnime.js`](src/data/freeAnime.js). |
| YouTube (privacy-enhanced embed) | Official trailers | Loaded only when you press play. |

The free catalog includes *Namakura Gatana* (1917), one of the oldest surviving Japanese animated films,
works by pioneers such as Noburō Ōfuji, Yasuji Murata and Sanae Yamamoto, and modern Creative Commons
anime like Production I.G's *Sol Levante*.

## Tech stack

React 19 · Vite 8 · Tailwind CSS 4 · Motion · TanStack Query 5 · Radix UI Dialog · Lucide icons ·
Fontsource (Dela Gothic One + Outfit) · oxlint

## Getting started

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |

## Project structure

```
src/
├── api/          AniList + Wikimedia Commons clients
├── components/   Navbar, Hero, Row, Cards, SearchResults, DetailDialog, …
├── data/         freeAnime.js, the curated free film list
├── hooks/        TanStack Query hooks, search ↔ URL sync
├── lib/          Formatting helpers
└── index.css     Tailwind theme: palette, fonts, utilities
```

## Palette

| Token | Hex | Name |
| --- | --- | --- |
| `yuzu` | `#f5ffc6` | Cream |
| `sora` | `#b4e1ff` | Icy Blue |
| `fuji` | `#ab87ff` | Soft Periwinkle |
| `sakura` | `#fface4` | Blush Pop |
| `matcha` | `#c1ff9b` | Light Green |

The tokens are named after Japanese motifs and used as Tailwind colors (`bg-sakura`, `text-matcha`, …).
The `night-*` neutrals are tinted toward `fuji`. Black-and-white classics get a palette tint, cream for the
silent era and icy blue for the prewar shorts, which fades away on hover.

## Adding a free film

1. Find an anime video on [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Anime_videos) that is
   public domain or under a Creative Commons license.
2. Add an entry to `src/data/freeAnime.js` with its exact file name (without the `File:` prefix), a
   `section` (`cc`, `silent` or `prewar`), a display title and the creator.
3. Optionally set `seek` (in seconds) to pick a nicer thumbnail frame.

Thumbnails, durations, licenses, credits and video streams are fetched from Commons automatically.

## Deploying

It's a static site: `npm run build` and host `dist/` anywhere (Vercel, Netlify, Cloudflare Pages…).
For GitHub Pages at `https://<user>.github.io/anime-slayer/`, add `base: '/anime-slayer/'` to `vite.config.js`.

## Credits

Anime titles, artwork and trailers belong to their respective owners and are served through AniList and YouTube.
Free films are credited in the app with their license and a link to their Wikimedia Commons page.
This is a fan project, not affiliated with Netflix, AniList or the Wikimedia Foundation.
