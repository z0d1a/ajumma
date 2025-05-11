import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-512x512.png'],
      manifest: {
        name: 'Ajumma Manhwa Reader',
        short_name: 'Ajumma',
        description: 'Read manhwa webtoons anywhere, offline capable',
        theme_color: '#111827',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-512x512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      // forward /api/* to your FastAPI/Uvicorn server
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})