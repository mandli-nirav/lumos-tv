/**
 * Static per-route SEO configuration.
 *
 * Keys are normalized pathnames (no trailing slash). `RouteSEO` (rendered
 * once in `AppLayout`) looks the current pathname up here and emits the
 * matching meta tags, so static pages need zero SEO code of their own.
 *
 * Dynamic routes (`/:type/:id`, `/watch/...`, 404) are intentionally absent —
 * those pages render their own `<SEO />` with data-driven values.
 *
 * @typedef {Object} RouteSeoEntry
 * @property {string|null} title - Page title (suffixed with the site name); null = site default title.
 * @property {string} description
 * @property {string} [keywords]
 * @property {boolean} [noindex] - Adds robots noindex/nofollow (e.g. internal search results).
 */

/** @type {Record<string, RouteSeoEntry>} */
export const routeSeo = {
  '/': {
    title: null,
    description:
      'Stream trending movies, popular TV shows, and free live TV channels on Lumos TV. Discover what to watch with ratings, trailers, and cast info — all in one place.',
    keywords:
      'watch movies online, stream tv shows, free live tv, watch series online, movie streaming, lumos tv',
  },
  '/movies': {
    title: 'Watch Movies Online — Popular & Top Rated Films',
    description:
      'Browse thousands of movies by genre, language, and rating. Watch trailers, check ratings, and stream popular and top-rated films online on Lumos TV.',
    keywords:
      'watch movies online, popular movies, top rated movies, movies by genre, stream films, lumos tv movies',
  },
  '/tv-shows': {
    title: 'Watch TV Shows Online — Popular & Top Rated Series',
    description:
      'Explore popular and top-rated TV series by genre and language. View seasons, episode guides, trailers, and ratings on Lumos TV.',
    keywords:
      'watch tv shows online, popular tv series, top rated shows, episode guide, stream series, lumos tv shows',
  },
  '/live-tv': {
    title: 'Live TV — Stream Free Live Channels Online',
    description:
      'Watch free live TV channels from around the world — news, sports, movies, music, and entertainment — streaming online on Lumos TV.',
    keywords:
      'free live tv, live tv channels, watch live tv online, live sports channels, live news streaming',
  },
  '/search': {
    title: 'Search Movies & TV Shows',
    description:
      'Search movies and TV shows by title. Instant results with posters, ratings, and details on Lumos TV.',
    // Internal search result pages should not be indexed (Google guideline).
    noindex: true,
  },
};

/**
 * Normalize a pathname for config lookup (collapse trailing slashes).
 *
 * @param {string} pathname
 * @returns {string}
 */
export function normalizePath(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}
