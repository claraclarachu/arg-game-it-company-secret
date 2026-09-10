import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/assets/js',
      '@core': '/assets/js/core',
      '@apps': '/assets/js/apps',
      '@ui': '/assets/js/ui',
      '@utils': '/assets/js/utils',
      '@data': '/assets/data'
    }
  },
  base: '/arg-game-it-company-secret/', 
  plugins: []
});