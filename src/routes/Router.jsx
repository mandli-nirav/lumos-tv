import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

import { exploreLoader, homeLoader, searchLoader } from '@/api/loaders';
import PageLoader from '@/components/PageLoader';
import AppLayout from '@/layouts/AppLayout';

const Home = lazy(() => import('@/pages/Home'));
const Explore = lazy(() => import('@/pages/Explore'));
const Search = lazy(() => import('@/pages/Search'));
const LiveTV = lazy(() => import('@/pages/LiveTV'));
const Watch = lazy(() => import('@/pages/Watch'));
const MediaDetails = lazy(() => import('@/pages/MediaDetails'));
const NotFound = lazy(() => import('@/pages/NotFound'));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    HydrateFallback: PageLoader,
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
            <Explore />
          </Suspense>
        ),
        loader: exploreLoader,
      },
      {
        path: '/tv-shows',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Explore />
          </Suspense>
        ),
        loader: exploreLoader,
      },
      {
        path: '/:type/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MediaDetails />
          </Suspense>
        ),
        loader: homeLoader,
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
