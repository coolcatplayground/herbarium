import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works from any GitHub Pages project path
  // (e.g. https://username.github.io/repo-name/) without extra config.
  base: './',
  plugins: [react()],
})
