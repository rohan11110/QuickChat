import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  proxy: {
    '/api': 'http://localhost:5001', // Example: proxy your API requests
  },resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // This maps `@` to the `src` directory
    },
  },
})
