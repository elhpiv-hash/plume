import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Dev server is pinned so the preview tooling can rely on a stable URL.
export default defineConfig(({ command }) => ({
  // On GitHub Pages the site is served from /<repo>/, so built asset URLs
  // must be prefixed with the repo name. Dev/preview stay at root.
  base: command === 'build' ? '/plume/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5181,
    strictPort: true,
  },
}));
