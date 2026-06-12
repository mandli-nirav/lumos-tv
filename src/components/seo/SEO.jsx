import { absoluteUrl, SITE } from '@/config/site';

import { JsonLd } from './JsonLd';

/**
 * Per-page SEO meta tags.
 *
 * Built on React 19 native document metadata: `<title>`, `<meta>` and
 * `<link>` rendered from any component are hoisted into `<head>`
 * automatically (no react-helmet provider needed). The static fallback tags
 * in `index.html` are marked with `data-seo-static` and removed at app boot
 * (see `main.jsx`), so exactly one managed set of tags exists at a time:
 * social-network scrapers (no JS) see the static set, search engines that
 * execute JS (Google, Bing) see this per-route set.
 *
 * Render exactly one `<SEO />` per page. Static routes are covered by
 * `RouteSEO` in the app layout; dynamic pages render their own.
 *
 * @param {Object} props
 * @param {string|null} [props.title] - Page title; suffixed with the site name. Falsy = site default title.
 * @param {string} [props.description] - Meta + OG/Twitter description.
 * @param {string} [props.keywords] - Meta keywords (legacy engines).
 * @param {string} [props.image] - Social image; path or absolute URL.
 * @param {string} [props.url] - Canonical path or absolute URL. Omit to skip the canonical tag.
 * @param {string} [props.type] - og:type (e.g. 'website', 'video.movie').
 * @param {boolean} [props.noindex] - Emit robots noindex/nofollow.
 * @param {'summary'|'summary_large_image'} [props.twitterCard] - Defaults to 'summary' for the brand icon, 'summary_large_image' for custom images.
 * @param {Object|Object[]} [props.jsonLd] - JSON-LD schema(s) to embed.
 * @param {import('react').ReactNode} [props.children] - Extra head tags.
 */
export function SEO({
  title,
  description = SITE.description,
  keywords,
  image = SITE.ogImage,
  url,
  type = 'website',
  noindex = false,
  twitterCard,
  jsonLd,
  children,
}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : SITE.defaultTitle;
  const canonical = url ? absoluteUrl(url) : null;
  const ogImage = absoluteUrl(image);
  const card =
    twitterCard ?? (image === SITE.ogImage ? 'summary' : 'summary_large_image');

  return (
    <>
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={keywords} />}
      <meta
        name='robots'
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      {canonical && <link rel='canonical' href={canonical} />}

      {/* Open Graph */}
      <meta property='og:site_name' content={SITE.name} />
      <meta property='og:locale' content={SITE.locale} />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={ogImage} />
      {canonical && <meta property='og:url' content={canonical} />}

      {/* Twitter Card */}
      <meta name='twitter:card' content={card} />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={ogImage} />

      {jsonLd && <JsonLd data={jsonLd} />}
      {children}
    </>
  );
}
