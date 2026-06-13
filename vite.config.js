import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    // Permitir acesso através de túneis (localtunnel, localhost.run, etc)
    allowedHosts: true
  }
});
