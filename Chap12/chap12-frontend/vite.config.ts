/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Luku 12: Vite-proxy -> /api-pyynnöt ohjataan backendille (sama origin, ei CORS-ongelmia).
  // Kirjassa backend on portissa 3000, meidän Chap11/Chap12-backend on portissa 8000.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  // Testit (Vitest + React Testing Library)
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
