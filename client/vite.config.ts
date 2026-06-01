import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Прокси для /api: внутри Docker -> http://server:3000 (через VITE_PROXY_TARGET),
// при локальном запуске -> http://localhost:3000
const apiTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
})
