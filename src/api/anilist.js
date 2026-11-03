import { htmlToText } from '../lib/format.js'
import { ApiError } from './http.js'

// AniList: free GraphQL API, no key needed for public data. https://docs.anilist.co
const ENDPOINT = 'https://graphql.anilist.co'

const MEDIA_FIELDS = /* GraphQL */ `
  fragment media on Media {
    id
    title { romaji english native }
    coverImage { extraLarge large color }
    bannerImage
    format
    status
    episodes
    duration
    season
    seasonYear
    averageScore
    genres
    description(asHtml: false)
    trailer { id site }
    studios(isMain: true) { nodes { name } }
    nextAiringEpisode { episode airingAt }
    siteUrl
  }
`

// Every home row in a single request, which keeps us far below the rate limit.
const HOME_QUERY = /* GraphQL */ `
  query Home($season: MediaSeason, $seasonYear: Int, $perPage: Int) {
    trending: Page(perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) { ...media }
    }
    season: Page(perPage: $perPage) {
      media(type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC, isAdult: false) { ...media }
    }
    popular: Page(perPage: $perPage) {
      media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) { ...media }
    }
    top: Page(perPage: $perPage) {
      media(type: ANIME, sort: SCORE_DESC, isAdult: false) { ...media }
    }
    movies: Page(perPage: $perPage) {
      media(type: ANIME, format: MOVIE, sort: POPULARITY_DESC, isAdult: false) { ...media }
    }
  }
  ${MEDIA_FIELDS}
`

const SEARCH_QUERY = /* GraphQL */ `
  query Search($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { currentPage hasNextPage }
      media(type: ANIME, search: $search, sort: [SEARCH_MATCH, POPULARITY_DESC], isAdult: false) { ...media }
    }
  }
  ${MEDIA_FIELDS}
`

async function request(query, variables, signal) {
  let response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Could not reach AniList — check your connection.')
  }

  const json = await response.json().catch(() => null)
  if (!response.ok || json?.errors?.length) {
    const message = json?.errors?.[0]?.message ?? `AniList request failed (${response.status})`
    throw new ApiError(message, { status: response.status })
  }
  return json.data
}

function toAnime(media) {
  return {
    kind: 'anime',
    key: `anime-${media.id}`,
    id: media.id,
    title: media.title.english || media.title.romaji,
    romaji: media.title.romaji,
    native: media.title.native,
    cover: media.coverImage.large,
    coverXL: media.coverImage.extraLarge,
    color: media.coverImage.color,
    banner: media.bannerImage,
    format: media.format,
    status: media.status,
    episodes: media.episodes,
    duration: media.duration,
    season: media.season,
    year: media.seasonYear,
    score: media.averageScore,
    genres: media.genres ?? [],
    description: htmlToText(media.description),
    trailerId: media.trailer?.site === 'youtube' ? media.trailer.id.trim() : null,
    studio: media.studios?.nodes?.[0]?.name ?? null,
    nextEpisode: media.nextAiringEpisode,
    url: media.siteUrl,
  }
}

export async function fetchHome({ season, year }, signal) {
  const data = await request(HOME_QUERY, { season, seasonYear: year, perPage: 20 }, signal)
  return Object.fromEntries(Object.entries(data).map(([row, page]) => [row, page.media.map(toAnime)]))
}

export async function searchAnime(term, page, signal) {
  const data = await request(SEARCH_QUERY, { search: term, page, perPage: 30 }, signal)
  return {
    page: data.Page.pageInfo.currentPage,
    hasNextPage: data.Page.pageInfo.hasNextPage,
    media: data.Page.media.map(toAnime),
  }
}
