import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as path from "node:path";
const isDev = process.env.NODE_ENV === 'development';
const devConfig = {
  server: {
    proxy: {
      '/arcgis/services/lauku_bloki/MapServer/WMSServer': {
        target: 'https://karte.lad.gov.lv',
        changeOrigin: true,
      }
    },
  }
}
const prodConfig = {
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
}

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
  ...(isDev ? devConfig : prodConfig),
})
