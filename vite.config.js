import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'favicon.svg', 'assets/logos/*.svg'],
      manifest: {
        id: '/',
        name: 'Lumos TV - Stream Movies, TV Shows & Sports',
        short_name: 'Lumos TV',
        description:
          'Watch unlimited movies, TV shows, and live sports streaming on Lumos TV. Your ultimate entertainment destination.',
        lang: 'en',
        categories: ['entertainment'],
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Cache TMDB images (static, safe to cache long-term)
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: { open: true, host: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // hls.js (in the lazy "player" chunk) is inherently ~600 kB and only loads
    // on watch/live routes, so raise the limit past it while still catching
    // regressions in eager chunks.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Emit the legal/info page chunks under a neutral "info-*" filename.
        // Their default names (e.g. "PrivacyPolicy-*.js") match ad-blocker
        // filter lists, which block the request (net::ERR_BLOCKED_BY_CLIENT)
        // and break the page for visitors who run an ad blocker. This only
        // renames the output file — the chunk graph is unchanged, so each
        // page stays its own small lazy chunk.
        chunkFileNames(chunkInfo) {
          if (
            /^(PrivacyPolicy|Terms|DMCA|Disclaimer|Contact)$/.test(
              chunkInfo.name
            )
          ) {
            return 'assets/info-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Heavy video stack — only pulled in by watch/live routes (lazy).
          if (id.includes('hls.js') || id.includes('artplayer')) return 'player';
          // Charting libs (recharts + its d3 deps).
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          // Carousels.
          if (id.includes('slick') || id.includes('embla')) return 'carousel';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('@radix-ui')) return 'radix';
          // React core kept together to avoid runtime init issues.
          if (
            id.includes('/react-dom/') ||
            id.includes('/react-router/') ||
            id.includes('/react/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
