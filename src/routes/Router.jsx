import { createBrowserRouter } from 'react-router';

import AppLayout from '@/layouts/AppLayout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Watch from '@/pages/Watch';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/:type/:id', element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/watch/:type/:id', element: <Watch /> },
  { path: '/watch/:type/:id/:season/:episode', element: <Watch /> },
]);
