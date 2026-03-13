import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// In Docker dev, the backend is reachable via the service name.
// Locally, it's on localhost. Set VITE_API_TARGET to override.
const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': apiTarget,
      '/resources': apiTarget
    }
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
