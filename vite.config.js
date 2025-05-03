import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss(),],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // You can customize your dark mode colors here
        'dark-bg': '#121212',
        'dark-surface': '#1e1e1e',
        'dark-border': '#2d2d2d',
      },
    },
  },
})



