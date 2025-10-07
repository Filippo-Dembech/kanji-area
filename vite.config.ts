import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({
      registerType: 'autoUpdate', // automatically updates service worker
      manifest: {
        name: 'Kanji Area',
        short_name: 'Kanji Area',
        description: 'Practice strike order and handwriting on this area.',
        start_url: '/kanji-area/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/kanji.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/kanji.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })],
  base: "/kanji-area/",
  server: {
    open: true
  }
})
