import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

import { homeLoader, moviesLoader, searchLoader, tvShowsLoader } from '@/api/loaders';
import PageLoader from '@/components/layout/PageLoader';
import { RouteError } from '@/components/layout/RouteError';
import AppLayout from '@/layouts/AppLayout';

const Home = lazy(() => import('@/pages/Home'));
const Movies = lazy(() => import('@/pages/Movies'));
const TVShows = lazy(() => import('@/pages/TVShows'));
const Search = lazy(() => import('@/pages/Search'));
const LiveTV = lazy(() => import('@/pages/LiveTV'));
const Watch = lazy(() => import('@/pages/Watch'));
const MediaDetails = lazy(() => import('@/pages/MediaDetails'));
const NotFound = lazy(() => import('@/pages/NotFound'));

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
        path: '/tv-shows',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TVShows />
          </Suspense>
        ),
        loader: tvShowsLoader,
      },
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
