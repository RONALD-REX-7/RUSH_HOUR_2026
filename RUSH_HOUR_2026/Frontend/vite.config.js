import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl') || id.includes('react-map-gl')) return 'mapbox-vendor';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'chart-vendor';
            if (id.includes('react-icons') || id.includes('react-hot-toast')) return 'ui-vendor';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
})
