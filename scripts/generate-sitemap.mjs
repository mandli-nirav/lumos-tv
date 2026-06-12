/**
 * Sitemap generator — writes public/sitemap.xml.
 *
 * Runs automatically before `vite build` (see package.json "build" script);
 * can also be run standalone with `npm run sitemap`.
 *
 * Includes:
 *  - the static indexable routes (the noindexed /search is excluded);
 *  - the current most-popular movie and TV detail pages from TMDB
 *    (a rolling window that keeps high-traffic detail URLs discoverable —
 *    the rest are found by crawling the on-page links).
 *
 * If no TMDB token is available (e.g. a CI environment without secrets),
 * the script degrades gracefully to a static-routes-only sitemap.
 *
 * Dependency-free: Node 18+ (global fetch) only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/** Keep in sync with src/config/site.js. */
const SITE_URL = 'https://lumos-tv.in';

/** Static indexable routes: [path, changefreq, priority]. */
const STATIC_ROUTES = [
  ['/', 'daily', '1.0'],
  ['/movies', 'daily', '0.9'],
  ['/tv-shows', 'daily', '0.9'],
  ['/live-tv', 'daily', '0.8'],
];

/** Pages of TMDB "popular" results to include per media type (20 per page). */
const POPULAR_PAGES = 5;

/**
 * Minimal .env parser — reads VITE_TMDB_READ_ACCESS_TOKEN without adding a
 * dotenv dependency. process.env wins over .env files.
 *
 * @returns {string|undefined}
 */
function readTmdbToken() {
  if (process.env.VITE_TMDB_READ_ACCESS_TOKEN) {
    return process.env.VITE_TMDB_READ_ACCESS_TOKEN;
  }
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(resolve(ROOT, file), 'utf8');
      const match = content.match(
        /^\s*VITE_TMDB_READ_ACCESS_TOKEN\s*=\s*"?([^"\r\n]+)"?\s*$/m
      );
      if (match) return match[1].trim();
    } catch {
      // file absent — keep looking
    }
  }
  return undefined;
}

/**
 * Fetch the first N pages of popular titles for a media type.
 *
 * @param {'movie'|'tv'} type
 * @param {string} token
 * @returns {Promise<Array<{path: string}>>}
 */
async function fetchPopular(type, token) {
  const pages = await Promise.all(
    Array.from({ length: POPULAR_PAGES }, async (_, i) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/popular?page=${i + 1}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`TMDB ${type}/popular p${i + 1}: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    })
  );
  return pages.flat().map((item) => ({ path: `/${type}/${item.id}` }));
}

/**
 * @param {{path: string, changefreq?: string, priority?: string}} entry
 * @param {string} lastmod - ISO date (YYYY-MM-DD).
 * @returns {string}
 */
function urlNode({ path, changefreq, priority }, lastmod) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

async function main() {
  const lastmod = new Date().toISOString().split('T')[0];
  const entries = STATIC_ROUTES.map(([path, changefreq, priority]) => ({
    path,
    changefreq,
    priority,
  }));

  const token = readTmdbToken();
  if (token) {
    try {
      const [movies, shows] = await Promise.all([
        fetchPopular('movie', token),
        fetchPopular('tv', token),
      ]);
      const seen = new Set(entries.map((e) => e.path));
      for (const entry of [...movies, ...shows]) {
        if (!seen.has(entry.path)) {
          seen.add(entry.path);
          entries.push({ ...entry, changefreq: 'weekly', priority: '0.7' });
        }
      }
      console.log(
        `sitemap: ${movies.length} movies + ${shows.length} TV shows from TMDB`
      );
    } catch (err) {
      console.warn(`sitemap: TMDB fetch failed (${err.message}) — static routes only`);
    }
  } else {
    console.warn('sitemap: no VITE_TMDB_READ_ACCESS_TOKEN — static routes only');
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) => urlNode(entry, lastmod)),
    '</urlset>',
    '',
  ].join('\n');

  const outFile = resolve(ROOT, 'public', 'sitemap.xml');
  writeFileSync(outFile, xml, 'utf8');
  console.log(`sitemap: wrote ${entries.length} URLs -> ${outFile}`);
}

main().catch((err) => {
  console.error('sitemap: generation failed:', err);
  process.exitCode = 1;
});
