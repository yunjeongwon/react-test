import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('Loaded ENV:', process.env.VITE_PORT);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: Number(process.env.VITE_PORT) || 5173
  }
})
