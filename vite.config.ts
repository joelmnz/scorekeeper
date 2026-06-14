import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/apple-touch-icon.png', 'icons/scorekeeper-icon.svg'],
      manifest: {
        name: 'Scorekeeper',
        short_name: 'Scorekeeper',
        description: 'Mobile score tracking for round-based tabletop and party games.',
        start_url: '/scorekeeper/',
        scope: '/scorekeeper/',
        display: 'standalone',
        background_color: '#09090b',
        theme_color: '#09090b',
        icons: [
          {
            src: 'icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/scorekeeper/index.html',
      },
    }),
  ],
  base: '/scorekeeper/',
});
