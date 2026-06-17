import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves this repo at /Me/
  base: '/Me/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
  },
});
