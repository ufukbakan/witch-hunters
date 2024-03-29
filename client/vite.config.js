import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  server:{
    host: true,
    open: true,
    port: 80,
  },
  build: {
    target: "esnext",
    outDir: "../dist"
  },
  preview:{
    port: 80,
    host: true,
    
  },
  logLevel: 'silent'
})
