import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server:{
    host: true,
    open: true,
    port: 8080,
  }
})
