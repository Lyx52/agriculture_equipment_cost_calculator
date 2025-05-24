import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import vueDevTools from 'vite-plugin-vue-devtools';
import pkg from './package.json'
import { format } from 'date-fns'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools()
  ],
  server: {
    port: 9696,
    proxy: {
      '/Auth': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/Indicators': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/UserAdjustment': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/StaticData': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/UserFarmland': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/FarmlandOperation': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/Codifier': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/UserCropType': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/UserEquipment': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
      '/Equipment': {
        target: 'https://backend.ikarslab.id.lv',
        changeOrigin: true
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
    },
  },
})
