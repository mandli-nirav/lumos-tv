import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

import tmdb from '@/api/tmdb';

/**
 * Fetch trending media.
 * @param {string} type - 'all', 'movie', 'tv', 'person'
 * @param {string} timeWindow - 'day', 'week'
 */
export const useTrending = (type = 'all', timeWindow = 'day', options = {}) => {
  return useQuery({
    queryKey: ['trending', type, timeWindow],
    queryFn: async () => {
      const response = await tmdb.get(`/trending/${type}/${timeWindow}`, {
        params: { append_to_response: 'videos,images,external_ids' },
      });
      return response.data;
    },
    ...options,
  });
};

/**
 * Fetch popular movies.
 */
export const usePopularMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: async () => {
      const response = await tmdb.get('/movie/popular', {
        params: { page },
      });
      return response.data;
    },
  });
};

/**
 * Fetch infinite popular media.
 */
export const useInfinitePopularMedia = (type, options = {}) => {
  return useInfiniteQuery({
    queryKey: [type === 'movie' ? 'movies' : type, 'popular', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdb.get(`/${type}/popular`, {
        params: { page: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    ...options,
  });
};

/**
 * Fetch infinite popular movies.
 */
export const useInfinitePopularMovies = (options = {}) => {
  return useInfinitePopularMedia('movie', options);
};

/**
 * Fetch popular TV shows.
 */
export const usePopularTV = (page = 1) => {
  return useQuery({
    queryKey: ['tv', 'popular', page],
    queryFn: async () => {
      const response = await tmdb.get('/tv/popular', {
        params: { page },
      });
      return response.data;
    },
  });
};

/**
 * Fetch infinite popular TV shows.
 */
export const useInfinitePopularTV = (options = {}) => {
  return useInfinitePopularMedia('tv', options);
};

/**
 * Fetch top rated movies.
 */
export const useTopRatedMovies = (page = 1) => {
  return useQuery({
    queryKey: ['movies', 'top_rated', page],
    queryFn: async () => {
      const response = await tmdb.get('/movie/top_rated', { params: { page } });
      return response.data;
    },
  });
};

/**
 * Fetch details for a specific movie or TV show.
 * Supports append_to_response by default via Axios instance.
 */
export const useMediaDetails = (type, id) => {
  return useQuery({
    queryKey: ['media', type, id],
    queryFn: async () => {
      const response = await tmdb.get(`/${type}/${id}`, {
        params: {
          append_to_response: 'videos,images,credits,similar,external_ids',
        },
      });
      return response.data;
    },
    enabled: !!type && !!id,
  });
};

/**
 * Fetch infinite similar media for a specific movie or TV show.
 */
export const useInfiniteSimilarMedia = (type, id) => {
  return useInfiniteQuery({
    queryKey: ['media', type, id, 'similar'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdb.get(`/${type}/${id}/similar`, {
        params: { page: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!type && !!id,
  });
};

/**
 * Fetch details for a specific season of a TV show.
 */
export const useSeasonDetails = (tvId, seasonNumber, options = {}) => {
  return useQuery({
    queryKey: ['tv', tvId, 'season', seasonNumber],
    queryFn: async () => {
      const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`, {
        params: { append_to_response: 'videos,images,external_ids' },
      });
      return response.data;
    },
    enabled: !!tvId && seasonNumber !== undefined && options.enabled !== false,
    ...options,
  });
};

/**
 * Fetch genre lists for both movies and TV shows and provide a combined lookup.
 */
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres', 'all'],
    queryFn: async () => {
      const [movieGenres, tvGenres] = await Promise.all([
        tmdb.get('/genre/movie/list'),
        tmdb.get('/genre/tv/list'),
      ]);

      const allGenres = _.concat(
        _.get(movieGenres, 'data.genres', []),
        _.get(tvGenres, 'data.genres', [])
      );

      return _.mapValues(_.keyBy(allGenres, 'id'), 'name');
    },
    staleTime: 24 * 60 * 60 * 1000, // Genres rarely change, cache for 24h
  });
};

/**
 * Multi-search for movies, TV shows, and people.
 */
export const useSearchMedia = (query, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['search', 'multi', query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdb.get('/search/multi', {
        params: { query, page: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!query,
    ...options,
  });
};
