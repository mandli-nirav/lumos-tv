import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

import { exploreLoader, homeLoader, searchLoader } from '@/api/loaders';
import PageLoader from '@/components/PageLoader';
import AppLayout from '@/layouts/AppLayout';

const Home = lazy(() => import('@/pages/Home'));
const Explore = lazy(() => import('@/pages/Explore'));
const Search = lazy(() => import('@/pages/Search'));
const Sports = lazy(() => import('@/pages/sports/Sports'));
const Watch = lazy(() => import('@/pages/Watch'));
const WatchSport = lazy(() => import('@/pages/sports/WatchSport'));
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
        path: '/sports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Sports />
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
  {
    path: '/sports/watch/:matchId',
    HydrateFallback: PageLoader,
    element: (
      <Suspense fallback={<PageLoader />}>
        <WatchSport />
      </Suspense>
    ),
  },
]);
