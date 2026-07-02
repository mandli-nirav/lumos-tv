/**
 * Video player server configuration.
 * Centralized list of streaming servers with their URL patterns.
 *
 * Each server supports both movie and TV show playback.
 *
 * WARNING: These are stream-scraping services.
 * Only use for content you have rights to stream.
 */

/**
 * Brand primary color in hex (no #) — matches --primary in index.css:
 * oklch(0.6677 0.2235 36.99) → #FF4D00
 * Update here if the theme color changes.
 */
const BRAND_COLOR = 'FF4D00';

export const PLAYER_SERVERS = [
  {
    id: 'videasy',
    name: 'Server 1 (Videasy)',
    url: 'https://player.videasy.to',
    patterns: {
      movie: `movie/{id}?color=${BRAND_COLOR}&overlay=true`,
      tv: `tv/{id}/{season}/{episode}?color=${BRAND_COLOR}&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true`,
    },
  },
  {
    id: 'vidking',
    name: 'Server 2 (VidKing)',
    url: 'https://vidking.net/embed',
    patterns: {
      movie: `movie/{id}?color=${BRAND_COLOR}`,
      tv: `tv/{id}/{season}/{episode}?color=${BRAND_COLOR}&nextEpisode=true&episodeSelector=true`,
    },
  },
  {
    id: 'vidsrc-cc',
    name: 'Server 3 (VidSrc.cc)',
    url: 'https://vidsrc.cc/v2/embed',
    patterns: {
      movie: 'movie/{id}',
      tv: 'tv/{id}/{season}/{episode}',
    },
  },
  // VidSrc.me — the original vidsrc.me and its .in/.net/.pm/.xyz/.io/.vc/.bz/.gd/.do/.mn/.tw
  // domains are dead or deprecated. These are the current live mirror domains, all serving the
  // same `/embed/movie?tmdb=` API. Listed .su-first (more takedown-resistant) so failover prefers
  // the sturdier TLD. handleServerError() auto-cycles through them in order.
  {
    id: 'vidsrcme-su',
    name: 'Server 4 (VidSrc.me — vidsrcme.su)',
    url: 'https://vidsrcme.su/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vidsrc-me-su',
    name: 'Server 5 (VidSrc.me — vidsrc-me.su)',
    url: 'https://vidsrc-me.su/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vidsrc-embed-su',
    name: 'Server 6 (VidSrc.me — vidsrc-embed.su)',
    url: 'https://vidsrc-embed.su/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vsrc-su',
    name: 'Server 7 (VidSrc.me — vsrc.su)',
    url: 'https://vsrc.su/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vidsrcme-ru',
    name: 'Server 8 (VidSrc.me — vidsrcme.ru)',
    url: 'https://vidsrcme.ru/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vidsrc-me-ru',
    name: 'Server 9 (VidSrc.me — vidsrc-me.ru)',
    url: 'https://vidsrc-me.ru/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vidsrc-embed-ru',
    name: 'Server 10 (VidSrc.me — vidsrc-embed.ru)',
    url: 'https://vidsrc-embed.ru/embed',
    patterns: {
      movie: 'movie?tmdb={id}',
      tv: 'tv?tmdb={id}&season={season}&episode={episode}',
    },
  },
  {
    id: 'vidsrc-pro',
    name: 'Server 11 (VidSrc.pro)',
    url: 'https://vidsrc.pro/embed',
    patterns: {
      movie: 'movie/{id}',
      tv: 'tv/{id}/{season}/{episode}',
    },
  },
  {
    id: '2embed',
    name: 'Server 12 (2Embed)',
    url: 'https://www.2embed.cc',
    patterns: {
      movie: 'embed/{id}',
      tv: 'embedtv/{id}&s={season}&e={episode}',
    },
  },
  {
    id: 'autoembed',
    name: 'Server 13 (AutoEmbed 1)',
    url: 'https://player.autoembed.app/embed',
    patterns: {
      movie: 'movie/{id}',
      tv: 'tv/{id}/{season}/{episode}',
    },
  },
  {
    id: 'autoembed-2',
    name: 'Server 14 (AutoEmbed 2)',
    url: 'https://player.autoembed.app/embed',
    patterns: {
      movie: 'movie/{id}?server=2',
      tv: 'tv/{id}/{season}/{episode}?server=2',
    },
  },
  {
    id: 'autoembed-3',
    name: 'Server 15 (AutoEmbed 3)',
    url: 'https://player.autoembed.app/embed',
    patterns: {
      movie: 'movie/{id}?server=3',
      tv: 'tv/{id}/{season}/{episode}?server=3',
    },
  },
];

/**
 * Construct a full streaming URL for a given server and content.
 * @param {Object} server - Server object from PLAYER_SERVERS
 * @param {string} type - 'movie' or 'tv'
 * @param {number} id - TMDB ID
 * @param {number} season - Season number (TV only)
 * @param {number} episode - Episode number (TV only)
 * @returns {string} Full URL for the iframe
 */
export const constructPlayerUrl = (server, type, id, season, episode) => {
  if (!server || !type || id == null) return '';
  if (type === 'tv' && (season == null || episode == null)) return '';

  const isMovie = type === 'movie';
  const pattern = isMovie ? server.patterns.movie : server.patterns.tv;

  const url = pattern
    .replace('{id}', id)
    .replace('{season}', season)
    .replace('{episode}', episode);

  return `${server.url}/${url}`;
};
