import { defineConfig } from 'vite';

export default defineConfig({
  base: '/arraial/',
  server: {
    port: 3000,
    host: true,
    // Permitir acesso através de túneis (localtunnel, localhost.run, etc)
    allowedHosts: true
  }
});
