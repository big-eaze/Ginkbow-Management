import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'




export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js', // optional setup file
  },
})









/*export default {
  server: {
    proxy: {
      '/students': 'http://localhost:5000',
      '/staff': 'http://localhost:5000',
      '/results': 'http://localhost:5000',
      '/class-population': 'http://localhost:5000',
      '/exam-timetable' : 'http://localhost:5000',
      '/announcements': 'http://localhost:5000',
      "/auth/profile": 'http://localhost:5000',

      
      // and any other API routes
    },
  },
} */