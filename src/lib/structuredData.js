import { getImageUrl } from '@/api/tmdb';
import { absoluteUrl } from '@/config/site';

/**
 * schema.org JSON-LD builders.
 *
 * WebSite + Organization schemas are emitted statically from `index.html`
 * (visible without JS); the builders here cover data-driven pages.
 */

/**
 * Convert a TMDB runtime (minutes) to an ISO 8601 duration.
 *
 * @param {number} [minutes]
 * @returns {string|undefined} e.g. 130 -> 'PT2H10M'
 */
function isoDuration(minutes) {
  if (!minutes || minutes <= 0) return undefined;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`;
}

/**
 * Build a Movie or TVSeries schema from a TMDB details payload
 * (with `credits`/`aggregate_credits` and `videos` appended).
 *
 * @param {Object} media - TMDB movie/tv details object.
 * @param {'movie'|'tv'} type
 * @param {string} canonicalPath - e.g. `/movie/603`.
 * @returns {Object} JSON-LD Movie or TVSeries schema.
 */
export function mediaSchema(media, type, canonicalPath) {
  const isMovie = type === 'movie';
  const title = media.title || media.name;
  const datePublished = media.release_date || media.first_air_date;
  const credits = media.credits || media.aggregate_credits;
  const cast = (credits?.cast || []).slice(0, 5);
  const directors = (credits?.crew || []).filter((c) => c.job === 'Director');
  const creators = media.created_by || [];
  const runtime = media.runtime || media.episode_run_time?.[0];
  const trailer = (media.videos?.results || []).find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const schema = {
    '@context': 'https://schema.org',
    '@type': isMovie ? 'Movie' : 'TVSeries',
    name: title,
    url: absoluteUrl(canonicalPath),
  };

  if (media.overview) schema.description = media.overview;
  if (media.poster_path) {
    schema.image = getImageUrl(media.poster_path, 'w780');
  }
  if (datePublished) schema.datePublished = datePublished;
  if (media.genres?.length) schema.genre = media.genres.map((g) => g.name);
  if (media.original_language) schema.inLanguage = media.original_language;

  const duration = isoDuration(runtime);
  if (duration) schema.duration = duration;

  if (media.vote_count > 0 && media.vote_average > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(media.vote_average.toFixed(1)),
      ratingCount: media.vote_count,
      bestRating: 10,
      worstRating: 1,
    };
  }

  if (cast.length) {
    schema.actor = cast.map((p) => ({ '@type': 'Person', name: p.name }));
  }
  if (isMovie && directors.length) {
    schema.director = directors.map((p) => ({
      '@type': 'Person',
      name: p.name,
    }));
  }
  if (!isMovie) {
    if (creators.length) {
      schema.creator = creators.map((p) => ({
        '@type': 'Person',
        name: p.name,
      }));
    }
    if (media.number_of_seasons) {
      schema.numberOfSeasons = media.number_of_seasons;
    }
    if (media.number_of_episodes) {
      schema.numberOfEpisodes = media.number_of_episodes;
    }
  }

  // Google requires name + thumbnailUrl + uploadDate for VideoObject.
  if (trailer?.published_at) {
    schema.trailer = {
      '@type': 'VideoObject',
      name: trailer.name,
      embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
      thumbnailUrl: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`,
      uploadDate: trailer.published_at,
    };
  }

  return schema;
}

/**
 * Build a BreadcrumbList schema.
 *
 * @param {Array<{label: string, href?: string}>} items - Ordered trail; the last item (current page) may omit `href`.
 * @returns {Object} JSON-LD BreadcrumbList schema.
 */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
