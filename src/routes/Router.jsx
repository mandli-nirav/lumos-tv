import { createBrowserRouter } from 'react-router';

import AppLayout from '@/layouts/AppLayout';
import Explore from '@/pages/Explore';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Search from '@/pages/Search';
import Sports from '@/pages/sports/Sports';
import WatchSport from '@/pages/sports/WatchSport';
import Watch from '@/pages/Watch';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/sports', element: <Sports /> },
      { path: '/movies', element: <Explore /> },
      { path: '/tv', element: <Explore /> },
      { path: '/tv-shows', element: <Explore /> },
      { path: '/series', element: <Explore /> },
      { path: '/:type/:id', element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/watch/:type/:id', element: <Watch /> },
  { path: '/watch/:type/:id/:season/:episode', element: <Watch /> },
  { path: '/sports/watch/:matchId', element: <WatchSport /> },
]);
