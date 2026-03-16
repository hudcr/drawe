import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Force all packages to use the same React instance (prevents duplicate React error
    // when react-router-dom resolves from ../node_modules with its own React copy)
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/functions',
      'react-router-dom',
    ],
  },
  server: {
    fs: { allow: ['..'] },
  },
})
