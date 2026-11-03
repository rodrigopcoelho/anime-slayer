import { htmlToText } from '../lib/format.js'
import { ApiError } from './http.js'

// Wikimedia Commons: free MediaWiki API, CORS-enabled with origin=*.
// Every file there is public domain or under a free license, with the license in its metadata.
const ENDPOINT = 'https://commons.wikimedia.org/w/api.php'

// Wikimedia only renders thumbnails at standard widths.
const THUMB_WIDTHS = [330, 500, 960, 1280, 1920]

const fitWidth = (sourceWidth, max) =>
  THUMB_WIDTHS.filter((width) => width <= Math.min(max, sourceWidth ?? max)).at(-1) ?? THUMB_WIDTHS[0]

// Rewrites a Commons video thumbnail URL to a given width and frame (seek, in seconds).
function thumbUrl(thumburl, { width, seek }) {
  if (!thumburl) return null
  const url = new URL(thumburl)
  const segments = url.pathname.split('/')
  const match = segments.at(-1).match(/^\d+px-(?:seek%3D[\d.]+)?-(.+)$/)
  if (!match) return thumburl
  segments[segments.length - 1] = `${width}px-${seek ? `seek%3D${seek}` : ''}-${match[1]}`
  url.pathname = segments.join('/')
  url.search = ''
  return url.href
}

const absolute = (src) => (src.startsWith('//') ? `https:${src}` : src)

function videoSources(info) {
  const sources = (info.derivatives ?? []).map((d) => ({
    src: absolute(d.src),
    type: d.type,
    height: d.height ?? 0,
    // VP9 WebM plays everywhere modern; the MP4/MOV transcode is the old-Safari fallback.
    rank: d.type.startsWith('video/webm') ? 0 : 1,
  }))
  if (!sources.length && info.mime === 'video/webm') {
    sources.push({ src: absolute(info.url), type: info.mime, height: info.height ?? 0, rank: 0 })
  }
  return sources
}

const yearFrom = (text) => Number(text?.match(/\b(1[89]\d\d|20\d\d)\b/)?.[1]) || null

export async function fetchFreeFilms(catalog, signal) {
  const params = {
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    prop: 'videoinfo',
    viprop: 'url|size|mime|extmetadata|derivatives',
    viurlwidth: '500',
    viextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|DateTimeOriginal',
    titles: catalog.map((film) => `File:${film.file}`).join('|'),
  }

  // Large metadata responses are paginated through `continue`.
  const infoByTitle = new Map()
  let next = {}
  while (next) {
    const response = await fetch(`${ENDPOINT}?${new URLSearchParams({ ...params, ...next })}`, { signal })
    if (!response.ok) throw new ApiError(`Wikimedia Commons request failed (${response.status})`, { status: response.status })
    const json = await response.json()
    if (json.error) throw new ApiError(json.error.info)

    const original = new Map((json.query?.normalized ?? []).map(({ from, to }) => [to, from]))
    for (const page of json.query?.pages ?? []) {
      if (page.videoinfo?.[0]) infoByTitle.set(original.get(page.title) ?? page.title, page.videoinfo[0])
    }
    next = json.continue ?? null
  }

  // Files that were renamed or removed on Commons are simply skipped.
  return catalog.flatMap((film) => {
    const info = infoByTitle.get(`File:${film.file}`)
    if (!info) return []
    const meta = info.extmetadata ?? {}
    const field = (name) => htmlToText(meta[name]?.value)

    return {
      ...film,
      kind: 'free',
      key: `free-${film.file}`,
      year: film.year ?? yearFrom(field('DateTimeOriginal')),
      license: field('LicenseShortName') || 'Free license',
      licenseUrl: meta.LicenseUrl?.value ?? null,
      credit: field('Artist') || film.creator,
      duration: info.duration ?? null,
      thumb: thumbUrl(info.thumburl, { width: fitWidth(info.width, 500), seek: film.seek }),
      still: thumbUrl(info.thumburl, { width: fitWidth(info.width, 1280), seek: film.seek }),
      sources: videoSources(info),
      pageUrl: info.descriptionurl,
    }
  })
}
