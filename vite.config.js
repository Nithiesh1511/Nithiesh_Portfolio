import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// three.js and the postprocessing chain are ~800 KB together. They are split
// into their own chunks and the scene is lazy-loaded, so the page shell paints
// long before the WebGL bundle has finished arriving.
export default defineConfig({
  plugins: [react()],
  base: '/Nithiesh_Portfolio/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          /* @react-three/* contains "three", so it has to be matched first or
             the two chunks end up importing each other. */
          if (id.includes('@react-three') || id.includes('postprocessing')) return 'r3f'
          if (id.includes('three')) return 'three'
          if (id.includes('framer-motion') || id.includes('motion-dom')) return 'motion'
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
