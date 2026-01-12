import tmdb from '@/api/tmdb';

export async function homeLoader() {
  const [trending, popularMovies, popularTV] = await Promise.all([
    tmdb.get('/trending/all/day', {
      params: { append_to_response: 'videos,images,external_ids' },
    }),
    tmdb.get('/movie/popular', { params: { page: 1 } }),
    tmdb.get('/tv/popular', { params: { page: 1 } }),
  ]);

  return {
    trending: trending.data,
    popularMovies: popularMovies.data,
    popularTV: popularTV.data,
  };
}

export async function exploreLoader({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const isMovie = pathname.includes('movies');
  const isTV = pathname.includes('tv-shows');

  const type = isMovie ? 'movie' : isTV ? 'tv' : null;

  if (!type) return null;

  const response = await tmdb.get(`/${type}/popular`, {
    params: { page: 1 },
  });

  return response.data;
}

export async function searchLoader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  if (!q) return null;

  const response = await tmdb.get('/search/multi', {
    params: { query: q, page: 1 },
  });
  return { results: response.data, q };
}
