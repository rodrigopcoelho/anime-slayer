import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { fetchHome, searchAnime } from '../api/anilist.js'
import { fetchFreeFilms } from '../api/commons.js'
import { FREE_ANIME } from '../data/freeAnime.js'
import { currentSeason } from '../lib/format.js'

export function useHomeRows() {
  const season = currentSeason()
  return useQuery({
    queryKey: ['anilist', 'home', season],
    queryFn: ({ signal }) => fetchHome(season, signal),
  })
}

export function useFreeFilms() {
  return useQuery({
    queryKey: ['commons', 'free-anime'],
    queryFn: ({ signal }) => fetchFreeFilms(FREE_ANIME, signal),
    staleTime: Infinity,
  })
}

export function useAnimeSearch(term) {
  return useInfiniteQuery({
    queryKey: ['anilist', 'search', term],
    queryFn: ({ pageParam, signal }) => searchAnime(term, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasNextPage ? last.page + 1 : undefined),
    enabled: term.length >= 2,
    placeholderData: keepPreviousData,
  })
}
