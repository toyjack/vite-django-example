import { fileURLToPath, URL } from 'url'
import {resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // root: resolve('./static/src'),
  // base:'/static/',
  server: {
    host: 'localhost',
    port: 3000,
    open: false,
    watch: {
      usePolling: true,
      disableGlobbing: false,
    },
  },
  build:{
    manifest: true,
    emptyOutDir: true,
    assetsDir: '',
    rollupOptions:{
      input:{
        main: './src/main.ts'
      },
      output:{
        chunkFileNames: undefined,
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
