import tmdb from '@/api/tmdb';

const EMPTY_PAGE = { results: [] };

export async function homeLoader() {
  try {
    const results = await Promise.allSettled([
      tmdb.get('/trending/all/day', {
        params: { append_to_response: 'videos,images,external_ids' },
      }),
      tmdb.get('/movie/popular', { params: { page: 1 } }),
      tmdb.get('/tv/popular', { params: { page: 1 } }),
      tmdb.get('/movie/top_rated', { params: { page: 1 } }),
      tmdb.get('/tv/top_rated', { params: { page: 1 } }),
    ]);

    const data = results.map((r) =>
      r.status === 'fulfilled' ? r.value.data : EMPTY_PAGE
    );

    return {
      trending: data[0],
      popularMovies: data[1],
      popularTV: data[2],
      topRatedMovies: data[3],
      topRatedTV: data[4],
    };
  } catch {
    return {
      trending: EMPTY_PAGE,
      popularMovies: EMPTY_PAGE,
      popularTV: EMPTY_PAGE,
      topRatedMovies: EMPTY_PAGE,
      topRatedTV: EMPTY_PAGE,
    };
  }
}

async function popularLoader(type) {
  try {
    const response = await tmdb.get(`/${type}/popular`, {
      params: { page: 1 },
    });
    return response.data;
  } catch {
    return EMPTY_PAGE;
  }
}

export const moviesLoader = () => popularLoader('movie');
export const tvShowsLoader = () => popularLoader('tv');

export async function searchLoader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  if (!q) return null;

  try {
    const response = await tmdb.get('/search/multi', {
      params: { query: q, page: 1 },
    });
    return { results: response.data, q };
  } catch {
    return { results: EMPTY_PAGE, q };
  }
}
