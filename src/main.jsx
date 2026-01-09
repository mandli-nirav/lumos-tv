import '@/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ThemeProvider } from '@/components/theme-provider';
import { router } from '@/routes/Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider storageKey='lumos-tv-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <InstallPrompt />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
