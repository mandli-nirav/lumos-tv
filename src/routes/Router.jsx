import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

import {
  homeLoader,
  moviesLoader,
  searchLoader,
  tvShowsLoader,
} from '@/api/loaders';
import PageLoader from '@/components/layout/PageLoader';
import { RouteError } from '@/components/layout/RouteError';
import AppLayout from '@/layouts/AppLayout';

const Home = lazy(() => import('@/pages/Home'));
const Movies = lazy(() => import('@/pages/Movies'));
const TVShows = lazy(() => import('@/pages/TVShows'));
const Collections = lazy(() => import('@/pages/Collections'));
const CollectionDetails = lazy(() => import('@/pages/CollectionDetails'));
const Search = lazy(() => import('@/pages/Search'));
const LiveTV = lazy(() => import('@/pages/LiveTV'));
const Watch = lazy(() => import('@/pages/Watch'));
const MediaDetails = lazy(() => import('@/pages/MediaDetails'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Legal / informational pages
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const Terms = lazy(() => import('@/pages/Terms'));
const DMCA = lazy(() => import('@/pages/DMCA'));
const Disclaimer = lazy(() => import('@/pages/Disclaimer'));
const Contact = lazy(() => import('@/pages/Contact'));

/**
 * Static legal/info routes. Each renders inside AppLayout (header, footer,
 * bottom nav) and gets its meta from RouteSEO via the routeSeo config.
 * Single-segment paths, so they never collide with the `/:type/:id` route.
 */
const legalRoutes = [
  { path: '/privacy', Component: PrivacyPolicy },
  { path: '/terms', Component: Terms },
  { path: '/dmca', Component: DMCA },
  { path: '/disclaimer', Component: Disclaimer },
  { path: '/contact', Component: Contact },
].map(({ path, Component }) => ({
  path,
  element: (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  ),
}));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    HydrateFallback: PageLoader,
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
        loader: homeLoader,
      },
      {
        path: '/search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Search />
          </Suspense>
        ),
        loader: searchLoader,
      },
      {
        path: '/live-tv',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LiveTV />
          </Suspense>
        ),
      },
      {
        path: '/movies',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Movies />
          </Suspense>
        ),
        loader: moviesLoader,
      },
      {
        path: '/collections',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Collections />
          </Suspense>
        ),
      },
      {
        path: '/collections/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CollectionDetails />
          </Suspense>
        ),
      },
      {
        path: '/tv-shows',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TVShows />
          </Suspense>
        ),
        loader: tvShowsLoader,
      },
      ...legalRoutes,
      {
        path: '/:type/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MediaDetails />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/watch/:type/:id',
    HydrateFallback: PageLoader,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Watch />
      </Suspense>
    ),
  },
  {
    path: '/watch/:type/:id/:season/:episode',
    HydrateFallback: PageLoader,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Watch />
      </Suspense>
    ),
  },
]);
