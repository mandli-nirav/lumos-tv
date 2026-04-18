import '@/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { router } from '@/routes/Router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider storageKey='lumos-tv-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <InstallPrompt />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
