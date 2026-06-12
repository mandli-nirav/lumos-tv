import { useLocation } from 'react-router';

import { normalizePath, routeSeo } from '@/config/seo';

import { SEO } from './SEO';

/**
 * Automatically emits SEO meta tags for static routes.
 *
 * Rendered once in `AppLayout`; looks the current pathname up in the
 * `routeSeo` config and renders the matching `<SEO />` (title, description,
 * canonical, OG/Twitter tags). Returns null for dynamic routes
 * (`/:type/:id`, 404) — those pages own their meta and render `<SEO />`
 * themselves, so there is never a duplicate set of tags.
 */
export function RouteSEO() {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const config = routeSeo[path];

  if (!config) return null;

  return <SEO {...config} url={path} />;
}
