import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import tmdb from '@/api/tmdb';

const DETAIL_APPEND_TO_RESPONSE = 'videos,images,external_ids,watch/providers,reviews,credits,aggregate_credits,release_dates,content_ratings';
const include_image_language = 'en,null';
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
        params: { include_image_language },
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
        params: { page, include_image_language },
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
        params: { page: pageParam, include_image_language },
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
        params: { page, include_image_language },
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
      const response = await tmdb.get('/movie/top_rated', {
        params: { page, include_image_language },
      });
      return response.data;
    },
  });
};

/**
 * Fetch infinite top-rated media.
 */
export const useInfiniteTopRatedMedia = (type, options = {}) => {
  return useInfiniteQuery({
    queryKey: [type === 'movie' ? 'movies' : type, 'top_rated', 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdb.get(`/${type}/top_rated`, {
        params: { page: pageParam, include_image_language },
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

export const useInfiniteTopRatedMovies = (options = {}) => {
  return useInfiniteTopRatedMedia('movie', options);
};

export const useInfiniteTopRatedTV = (options = {}) => {
  return useInfiniteTopRatedMedia('tv', options);
};

/**
 * Fetch details for a specific movie or TV show.
 * Includes full metadata: videos, images, credits, reviews, etc.
 */
export const useMediaDetails = (type, id) => {
  return useQuery({
    queryKey: ['media', type, id],
    queryFn: async () => {
      const response = await tmdb.get(`/${type}/${id}`, {
        params: { append_to_response: DETAIL_APPEND_TO_RESPONSE, include_image_language },
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
        params: { page: pageParam, include_image_language },
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
 * Fetch infinite recommendations for a specific movie or TV show.
 */
export const useInfiniteRecommendations = (type, id) => {
  return useInfiniteQuery({
    queryKey: ['media', type, id, 'recommendations'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdb.get(`/${type}/${id}/recommendations`, {
        params: { page: pageParam, include_image_language },
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
        params: { append_to_response: DETAIL_APPEND_TO_RESPONSE, include_image_language },
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

      const allGenres = [
        ...(movieGenres.data?.genres || []),
        ...(tvGenres.data?.genres || []),
      ];

      // Create a map: { id: name }
      return Object.fromEntries(allGenres.map((g) => [g.id, g.name]));
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};

/**
 * Fetch genre list for a specific type (movie or tv).
 */
export const useGenreList = (type) => {
  return useQuery({
    queryKey: ['genres', type],
    queryFn: async () => {
      const response = await tmdb.get(`/genre/${type}/list`);
      return response.data.genres || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!type,
  });
};

/**
 * Fetch infinite discover media with full TMDB filter support.
 * @param {string} type - 'movie' or 'tv'
 * @param {object} filters - All supported TMDB discover params
 */
export const useInfiniteDiscover = (type, filters = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['discover', type, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam,
        include_image_language,
        sort_by: filters.sortBy || 'popularity.desc',
      };

      // Common
      if (filters.genres?.length) params.with_genres = filters.genres.join(',');
      if (filters.withoutGenres?.length)
        params.without_genres = filters.withoutGenres.join(',');
      if (filters.language) params.with_original_language = filters.language;
      if (filters.voteAverageGte != null)
        params['vote_average.gte'] = filters.voteAverageGte;
      if (filters.voteAverageLte != null)
        params['vote_average.lte'] = filters.voteAverageLte;
      if (filters.voteCountGte != null)
        params['vote_count.gte'] = filters.voteCountGte;
      if (filters.runtimeGte != null) params['with_runtime.gte'] = filters.runtimeGte;
      if (filters.runtimeLte != null) params['with_runtime.lte'] = filters.runtimeLte;
      if (filters.watchProviders?.length)
        params.with_watch_providers = filters.watchProviders.join('|');
      if (filters.watchMonetizationTypes?.length)
        params.with_watch_monetization_types =
          filters.watchMonetizationTypes.join('|');
      if (
        filters.watchRegion ||
        filters.watchProviders?.length ||
        filters.watchMonetizationTypes?.length
      )
        params.watch_region = filters.watchRegion || 'US';
      if (filters.includeAdult) params.include_adult = true;

      if (type === 'movie') {
        if (filters.yearFrom)
          params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`;
        if (filters.yearTo)
          params['primary_release_date.lte'] = `${filters.yearTo}-12-31`;
        if (filters.releaseTypes?.length)
          params.with_release_type = filters.releaseTypes.join('|');
        if (filters.certification) {
          params.certification = filters.certification;
          params.certification_country = filters.certificationCountry || 'US';
        }
        if (filters.region) params.region = filters.region;
        if (filters.companies?.length)
          params.with_companies = filters.companies.join(',');
      } else {
        if (filters.yearFrom)
          params['first_air_date.gte'] = `${filters.yearFrom}-01-01`;
        if (filters.yearTo)
          params['first_air_date.lte'] = `${filters.yearTo}-12-31`;
        if (filters.networks?.length)
          params.with_networks = filters.networks.join(',');
        if (filters.tvStatus != null) params.with_status = filters.tvStatus;
        if (filters.tvType != null) params.with_type = filters.tvType;
        if (filters.originCountry)
          params.with_origin_country = filters.originCountry;
        if (filters.includeNullFirstAirDates)
          params.include_null_first_air_dates = true;
      }

      const response = await tmdb.get(`/discover/${type}`, { params });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!type,
    ...options,
  });
};

/**
 * Fetch TMDB countries list (ISO 3166-1).
 */
export const useCountries = () => {
  return useQuery({
    queryKey: ['configuration', 'countries'],
    queryFn: async () => {
      const response = await tmdb.get('/configuration/countries');
      return response.data || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};

/**
 * Fetch popular watch providers for a region.
 */
export const useWatchProviders = (type, region) => {
  return useQuery({
    queryKey: ['watch_providers', type, region],
    queryFn: async () => {
      const response = await tmdb.get(`/watch/providers/${type}`, {
        params: { watch_region: region || 'US' },
      });
      return response.data?.results || [];
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!type,
  });
};

/**
 * Fetch images (logos, backdrops, posters) for a movie or TV show.
 */
export const useMediaImages = (type, id) => {
  return useQuery({
    queryKey: ['media', type, id, 'images'],
    queryFn: async () => {
      const response = await tmdb.get(`/${type}/${id}/images`, {
        params: { include_image_language: 'en,null' },
      });
      return response.data;
    },
    enabled: !!type && !!id,
    staleTime: 24 * 60 * 60 * 1000,
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
