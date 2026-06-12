/**
 * Central site identity used by SEO meta tags, structured data and the
 * sitemap generator. Keep `scripts/generate-sitemap.mjs` in sync if the
 * origin ever changes.
 *
 * @typedef {Object} SiteConfig
 * @property {string} url - Canonical origin (no trailing slash).
 * @property {string} name - Brand name used in titles and og:site_name.
 * @property {string} defaultTitle - Title used when a page provides none.
 * @property {string} description - Default meta description.
 * @property {string} keywords - Default meta keywords.
 * @property {string} ogImage - Absolute-path default social sharing image.
 * @property {string} locale - Open Graph locale.
 */

/** @type {SiteConfig} */
export const SITE = {
  url: 'https://lumos-tv.in',
  name: 'Lumos TV',
  defaultTitle: 'Lumos TV — Watch Movies, TV Shows & Live TV Online',
  description:
    'Stream trending movies, popular TV shows, and free live TV channels on Lumos TV. Discover what to watch with ratings, trailers, and cast info — all in one place.',
  keywords:
    'watch movies online, stream tv shows, free live tv, watch series online, movie streaming, lumos tv',
  ogImage: '/icons/icon-512x512.png',
  locale: 'en_US',
};

/**
 * Resolve a path against the canonical origin.
 * Absolute URLs (e.g. TMDB images) pass through unchanged.
 *
 * @param {string} [path]
 * @returns {string}
 */
export function absoluteUrl(path = '') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}
