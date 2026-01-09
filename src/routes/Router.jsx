import { createBrowserRouter } from 'react-router';

import AppLayout from '@/layouts/AppLayout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Sports from '@/pages/sports/Sports';
import WatchSport from '@/pages/sports/WatchSport';
import Watch from '@/pages/Watch';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sports', element: <Sports /> },
      { path: '/:type/:id', element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/watch/:type/:id', element: <Watch /> },
  { path: '/watch/:type/:id/:season/:episode', element: <Watch /> },
  { path: '/sports/watch/:matchId', element: <WatchSport /> },
]);
