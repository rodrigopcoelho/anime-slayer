export const cn = (...classes) => classes.filter(Boolean).join(' ')

const FORMAT_LABELS = {
  TV: 'TV',
  TV_SHORT: 'TV Short',
  MOVIE: 'Movie',
  SPECIAL: 'Special',
  OVA: 'OVA',
  ONA: 'ONA',
  MUSIC: 'Music',
}

const STATUS_LABELS = {
  RELEASING: 'Airing',
  FINISHED: 'Finished',
  NOT_YET_RELEASED: 'Upcoming',
  CANCELLED: 'Cancelled',
  HIATUS: 'On hiatus',
}

const SEASONS = {
  WINTER: { label: 'Winter', kanji: '冬' },
  SPRING: { label: 'Spring', kanji: '春' },
  SUMMER: { label: 'Summer', kanji: '夏' },
  FALL: { label: 'Fall', kanji: '秋' },
}

export const formatLabel = (format) => FORMAT_LABELS[format] ?? format ?? null
export const statusLabel = (status) => STATUS_LABELS[status] ?? null
export const seasonInfo = (season) => SEASONS[season] ?? null

// AniList scores are 0–100; show them the way people expect: 8.7
export const formatScore = (score) => (score ? (score / 10).toFixed(1) : null)

// AniList seasons: Dec–Feb is WINTER (of the following year), then SPRING, SUMMER, FALL.
export function currentSeason(date = new Date()) {
  const month = date.getMonth()
  const year = date.getFullYear()
  if (month === 11) return { season: 'WINTER', year: year + 1 }
  if (month <= 1) return { season: 'WINTER', year }
  if (month <= 4) return { season: 'SPRING', year }
  if (month <= 7) return { season: 'SUMMER', year }
  return { season: 'FALL', year }
}

export function formatDuration(seconds) {
  if (!seconds) return null
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const rest = String(total % 60).padStart(2, '0')
  return `${minutes}:${rest}`
}

export function formatMinutes(seconds) {
  if (!seconds) return null
  return seconds < 90 ? `${Math.round(seconds)} sec` : `${Math.round(seconds / 60)} min`
}

export function timeUntil(unixSeconds) {
  const diff = unixSeconds * 1000 - Date.now()
  if (diff <= 0) return 'soon'
  const hours = Math.round(diff / 3_600_000)
  if (hours < 1) return 'in under an hour'
  if (hours < 48) return `in ${hours} h`
  return `in ${Math.round(hours / 24)} days`
}

// Turns API-provided HTML into plain text without ever injecting it into the page.
export function htmlToText(html) {
  if (!html) return ''
  const withBreaks = html.replace(/<br\s*\/?>/gi, '\n')
  const text = new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ?? ''
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

// Case- and accent-insensitive text for searching ("taro" finds "Tarō").
export const fold = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
