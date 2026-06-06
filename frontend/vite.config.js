import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ FIX #13 & #14: Add proxy so relative API calls (/jobs/active, etc.)
// route to the backend running on port 5000
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Also proxy direct backend routes used in the codebase
      '/jobs': { target: 'http://localhost:5000', changeOrigin: true },
      '/job-posting': { target: 'http://localhost:5000', changeOrigin: true },
      '/profile': { target: 'http://localhost:5000', changeOrigin: true },
      '/alumni-directory': { target: 'http://localhost:5000', changeOrigin: true },
      '/alumni-stories': { target: 'http://localhost:5000', changeOrigin: true },
      '/alumni-story': { target: 'http://localhost:5000', changeOrigin: true },
      '/events': { target: 'http://localhost:5000', changeOrigin: true },
      '/upload-event': { target: 'http://localhost:5000', changeOrigin: true },
      '/get-mentors': { target: 'http://localhost:5000', changeOrigin: true },
      '/mentor': { target: 'http://localhost:5000', changeOrigin: true },
      '/is-mentor': { target: 'http://localhost:5000', changeOrigin: true },
      '/send-request': { target: 'http://localhost:5000', changeOrigin: true },
      '/get-pending-requests': { target: 'http://localhost:5000', changeOrigin: true },
      '/get-requests-for-mentor': { target: 'http://localhost:5000', changeOrigin: true },
      '/update-request-status': { target: 'http://localhost:5000', changeOrigin: true },
      '/startup-zone': { target: 'http://localhost:5000', changeOrigin: true },
      '/get-startups': { target: 'http://localhost:5000', changeOrigin: true },
      '/post-Suggestions': { target: 'http://localhost:5000', changeOrigin: true },
      '/get-post-suggestion': { target: 'http://localhost:5000', changeOrigin: true },
      '/suggestions': { target: 'http://localhost:5000', changeOrigin: true },
      // '/signup': { target: 'http://localhost:5000', changeOrigin: true },
      // '/login': { target: 'http://localhost:5000', changeOrigin: true },
      '/alumni': { target: 'http://localhost:5000', changeOrigin: true },
      '/donations': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
