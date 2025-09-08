import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Hi-packa/', // Set base URL for GitHub Pages
  build: {
    outDir: 'build-gh-pages', // Output to 'build-gh-pages' folder for GitHub Pages
  },
});
