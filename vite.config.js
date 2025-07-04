import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/thomasschwartz18.github.io/Historle-React/',
  plugins: [react()],
})
