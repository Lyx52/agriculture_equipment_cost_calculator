import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
    }
  },
  server: {
    proxy: {
      '/arcgis/services/lauku_bloki/MapServer/WMSServer': {
        target: 'https://karte.lad.gov.lv',
        changeOrigin: true,
      },
      '/arcgis/services/lauku_bloki/MapServer/WFSServer': {
        target: 'https://karte.lad.gov.lv',
        changeOrigin: true,
      },
      '/arcgis/rest/services/ortofoto_cache/MapServer': {
        target: 'https://karte.lad.gov.lv',
        changeOrigin: true,
      }
    },
  },
  optimizeDeps: {
    include: ['@arcgis/core'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => 'index.js', // Combine everything into a single file
      },
    },
  },
})
