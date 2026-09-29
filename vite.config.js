import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true, // Listen on all local IPs so mobile phones can connect
    port: 5173
  }
});
