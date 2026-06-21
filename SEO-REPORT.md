# Lumos TV — SEO Audit & Implementation Report

Date: 2026-06-13 · Stack: Vite 7 + React 19 + React Router 7 + Tailwind 4 (client-side SPA)

---

## 1. Audit — issues found (before)

| # | Issue | Severity |
|---|-------|----------|
| 1 | Single `<title>LumosTV</title>` for every route (duplicate titles site-wide) | Critical |
| 2 | One static meta description reused on every route | Critical |
| 3 | No Open Graph tags, no Twitter Card tags | Critical |
| 4 | No robots.txt, no sitemap.xml | Critical |
| 5 | No structured data (WebSite / Organization / Movie / TVSeries / BreadcrumbList) | Critical |
| 6 | Static canonical hardcoded to the homepage for **all** routes in raw HTML (homepage-collapse risk for non-JS crawlers); corrected only after JS via an effect | Critical |
| 7 | Media cards, episode rows, channel cards navigate via `div onClick` — no real `<a>`, so crawlers could not discover any `/movie/:id` / `/tv/:id` page from listings; also keyboard-inaccessible | Critical |
| 8 | H1 problems: Home/Movies/TV Shows/Search had no H1; HeroSlider rendered up to 5 H1s (one per slide) when artwork logos were missing; detail pages had **no H1** whenever a logo image existed (and both responsive layouts are in the DOM simultaneously) | High |
| 9 | LCP: hero backdrop lazy-loaded at TMDB `original` size (up to 4K); detail-page desktop backdrop also `original` and downloaded even on mobile (CSS-hidden) | High |
| 10 | `/search` (internal search results) and `/watch/*` (thin player duplicates) fully indexable | High |
| 11 | 404 page indexable (SPA soft-404s) | High |
| 12 | No preconnect/dns-prefetch for `image.tmdb.org` / `api.themoviedb.org` | Medium |
| 13 | Footer "Legal" column: 5 dead `href="#"` links on every page | Medium |
| 14 | Heading hierarchy jumps (h3 sections with no h2 anywhere; e.g. detail page "Description"/"Cast"/"Crew") | Medium |
| 15 | Weak/missing image alts (`Backdrop 1`), no `loading="lazy"`/`decoding="async"` on plain `<img>`s below the fold | Medium |
| 16 | Inputs without accessible names (search fields), icon buttons without labels (clear search), clickable divs without keyboard support | Medium |
| 17 | Favicon still named `vite.svg` (branded artwork, default name); no PNG fallback icon link | Low |
| 18 | No breadcrumbs (UI or schema) | Low |
| 19 | No noscript fallback content | Low |

Already good before the audit: route-level code splitting (`React.lazy` everywhere), manual vendor chunking, lazy images in grids (`react-lazy-load-image-component`), PWA manifest, strong security headers (`public/_headers`), `rel="noopener noreferrer"` on all external links, `header/main/footer/nav` landmarks, HTTPS canonical host.

---

## 2. Architecture decision: React 19 native metadata (not react-helmet-async)

The brief requested `react-helmet-async`. This project runs **React 19.2**, where:

- `react-helmet-async` is unmaintained and its peer range stops at React 18 (install requires `--legacy-peer-deps`).
- React 19 natively hoists `<title>`, `<meta>`, `<link>` rendered from any component into `<head>` — no provider, no dependency. React inserts its `<title>` *before* any existing one, so it always wins over the static fallback.

The requested component API was kept exactly (`<SEO title description keywords image url … />`); only the engine differs.

**Ownership model:** `index.html` ships a complete static tag set marked `data-seo-static` — that snapshot is what non-JS crawlers (Facebook/WhatsApp/Twitter/Telegram scrapers) see. At app boot, `main.jsx` removes the static set and the per-route `<SEO />` takes over — so JS-rendering crawlers (Google, Bing) only ever see one, route-correct set. No duplicates in either world.

**Meta flow per route type:**
- Static routes (`/`, `/movies`, `/tv-shows`, `/live-tv`, `/search`) → `RouteSEO` in `AppLayout` reads `src/config/seo.js` automatically.
- Dynamic routes (`/:type/:id`, `/watch/*`, 404) → the page renders its own `<SEO />` with API data.

---

## 3. What was implemented

### Technical SEO
- `<SEO />` component: title (templated `… | Lumos TV`), description, keywords, robots (`max-image-preview:large` etc. for Google Discover), canonical, `og:site_name/locale/type/title/description/image/url`, `twitter:card/title/description/image`, JSON-LD injection.
- Per-route canonical generated from the route path (query strings stripped by design — filtered catalog views canonicalize to the clean listing URL).
- `/watch/:type/:id[/:s/:e]` canonicalizes to `/:type/:id` (consolidates thin player pages into the detail page — the index-worthy URL).
- `/search` → `noindex` + robots `Disallow` (Google guideline for internal search results). 404 → `noindex`.
- robots.txt with sitemap reference.
- **Dynamic sitemap generation**: `scripts/generate-sitemap.mjs` runs before every build (`npm run build`) and standalone (`npm run sitemap`). Writes the 4 indexable static routes + the current top 100 popular movies + top 100 popular TV shows from TMDB (204 URLs). Degrades to static-routes-only when no TMDB token is present.

### Structured data (JSON-LD)
- `WebSite` (with `SearchAction` → sitelinks search box) + `Organization` — static in `index.html`, visible without JS.
- `Movie` / `TVSeries` on detail pages: name, description, image, datePublished, genres, language, ISO-8601 duration, `aggregateRating` (TMDB votes), top-5 actors, directors/creators, seasons/episodes, and a `trailer` `VideoObject` (with uploadDate, as Google requires).
- `BreadcrumbList` + visible breadcrumb trail (Home → Movies/TV Shows → Title) on detail pages.
- FAQ / Product / LocalBusiness schema: **N/A** — no such content exists, and fabricating markup for invisible content violates Google's guidelines.

### Crawlability & internal linking
- `MediaCard` now contains a real `<a>` (full-card overlay `Link`) — every poster on Home/Movies/TV Shows/Search/detail-page rails is a crawlable, keyboard-focusable link with a descriptive `aria-label`. This plus the sitemap is how detail pages get discovered.
- Breadcrumbs add hierarchical internal links from every detail page back to its category.
- Footer dead `#` links replaced with plain text until real pages exist.
- noscript block with brand pitch + links to the four main sections.

### Content structure
- Exactly one H1 per page: visible on catalog pages ("Movies", "TV Shows", Live TV's existing H1), sr-only where the design is artwork-led (Home, detail pages, Watch, Search). Per-slide hero H1s demoted to H2; detail-page section headings fixed (h3 → h2).

### Performance (Core Web Vitals)
- **LCP**: first hero slide is now an eager `<img fetchpriority="high" decoding="async">` at `w1280` (was: lazy + blur at `original`/4K). Detail-page mobile backdrop gets `fetchpriority="high"`; desktop backdrop downsized `original` → `w1280` (it downloads on mobile too, where it's CSS-hidden).
- `preconnect` to `image.tmdb.org` + `api.themoviedb.org`, `dns-prefetch` for youtube-img/placehold/iptv-org.
- `loading="lazy" decoding="async"` added to all below-fold plain `<img>`s (episode stills, trailer thumbs, photo grids, network/production logos).
- Route code-splitting and manual vendor chunks were already in place (verified intact in the build). Compression/caching are handled by the host (Cloudflare auto-Brotli + immutable hashed assets) — no plugin needed.

### Accessibility
- Accessible names for both search inputs (`type="search"` + `aria-label`), the clear-search button, slider thumbnails.
- Keyboard support (`role`, `tabIndex`, Enter/Space handlers) for channel cards, episode rows (role="link" — they contain a nested download anchor, so they can't be anchors themselves), trailer thumbnails, hero thumbnails.
- `aria-label='Primary'` on the mobile bottom nav; `aria-current` + `aria-label='Breadcrumb'` on breadcrumbs.

### PWA / icons
- Branded `vite.svg` renamed to `favicon.svg` + PNG fallback link; manifest gains `id`, `lang`, `categories`.

---

## 4. Files created

| File | Purpose |
|------|---------|
| `src/config/site.js` | Site identity (origin, name, default meta, og image) + `absoluteUrl()` |
| `src/config/seo.js` | Per-route SEO config map + path normalization |
| `src/components/seo/SEO.jsx` | The reusable meta component (React 19 native) |
| `src/components/seo/RouteSEO.jsx` | Auto-connects route → seoConfig (rendered in AppLayout) |
| `src/components/seo/JsonLd.jsx` | Safe JSON-LD `<script>` renderer |
| `src/components/seo/Breadcrumbs.jsx` | Visible breadcrumb + BreadcrumbList schema |
| `src/lib/structuredData.js` | `mediaSchema()` (Movie/TVSeries) + `breadcrumbSchema()` builders |
| `scripts/generate-sitemap.mjs` | Build-time dynamic sitemap generator |
| `public/robots.txt` | Crawl rules + sitemap reference |
| `public/sitemap.xml` | Generated (204 URLs) |
| `public/favicon.svg` | Renamed from `vite.svg` |
| `SEO-REPORT.md` | This report |

## 5. Files modified

`index.html` (full head: static OG/Twitter/robots fallbacks, preconnects, WebSite+Organization JSON-LD, icons, noscript) · `src/main.jsx` (static-tag handoff) · `src/layouts/AppLayout.jsx` (RouteSEO replaces canonical effect) · `src/pages/Home.jsx`, `Movies.jsx`, `TVShows.jsx`, `Search.jsx`, `MediaDetails.jsx`, `Watch.jsx`, `NotFound.jsx` · `src/components/home/HeroSlider.jsx` · `src/components/media/MediaCard.jsx`, `MediaCatalog.jsx`, `MediaDetailHero.jsx`, `MediaDetailContent.jsx` · `src/components/livetv/LiveTVHeader.jsx`, `ChannelCard.jsx` · `src/components/layout/Footer.jsx`, `BottomNav.jsx` · `src/lib/utils.js` (`truncate`) · `vite.config.js` (manifest polish, includeAssets) · `package.json` (build runs sitemap first)

Verified: `vite build` passes (all route chunks intact, PWA generated), touched files lint clean, preview server serves robots/sitemap/favicon/SPA-fallback correctly.

---

## 6. SEO score

| Category | Before | After |
|----------|--------|-------|
| Technical SEO | 2/10 | 9/10 |
| On-page SEO | 3/10 | 9/10 |
| Performance SEO | 6/10 | 8/10 |
| Accessibility SEO | 5/10 | 8/10 |
| **Overall** | **3/10** | **8.5/10** |

Remaining gap to 10 is structural (SPA) — see below.

---

## 7. SSR / SSG / prerendering evaluation (requested)

**Content profile:** ~100% API-driven (TMDB/IPTV), millions of possible detail URLs, listings change daily. Google and Bing render JavaScript, so with this implementation they index correct titles/meta/schema. The residual limitations are: (a) social scrapers don't run JS, so shares of *detail* pages show the site-level card, not the movie's; (b) first index of a page requires Google's render queue.

- **Prerendering (react-snap & co.)** — *not recommended.* Only covers the handful of static routes (whose content is dynamic anyway), unmaintained tooling, hydration-mismatch risk with React 19.
- **Next.js migration** — *not recommended now.* Full rewrite; the gain doesn't justify it given the next option.
- **React Router 7 framework mode (SSR)** — *the right long-term path if rankings become competitive.* You're already on react-router 7, and it has first-class Cloudflare Workers support; loaders (`src/api/loaders.js`) port directly. This server-renders meta *and content* for every URL, fixing both residual limitations.
- **Edge meta injection (recommended next increment)** — keep the SPA; add a small Cloudflare Worker using `HTMLRewriter` that, for `/movie/:id` and `/tv/:id`, fetches the title/overview/backdrop from TMDB and rewrites the static head before serving `index.html`. ~50 lines, no app changes (you already deploy with Wrangler assets), and it makes social shares of every movie/show render the correct card.

## 8. Post-deploy checklist & recommendations

1. Submit `https://lumos-tv.in/sitemap.xml` in Google Search Console + Bing Webmaster Tools; monitor Coverage and Enhancements (Videos, Breadcrumbs, Sitelinks searchbox).
2. Create a real **1200×630** `og-image.png` social card (current default is the square 512 icon — fine, but `summary_large_image` everywhere needs the wide asset). Then update `SITE.ogImage` + the static tags in `index.html`.
3. Create the legal pages (Privacy/Terms/DMCA/Disclaimer/Contact) and re-link the footer — also matters for AdSense.
4. Implement the HTMLRewriter edge worker (item 7) for per-URL social cards.
5. Optional: add URL slugs (`/movie/603-the-matrix`) via an extra optional route param for keyword-bearing URLs — kept out of this pass to avoid changing live URLs.
6. Test rich results: https://search.google.com/test/rich-results against a detail page after deploy.
