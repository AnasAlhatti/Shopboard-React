import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { productApi } from './server/productApi.js';

// https://vite.dev/config/
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'shopboard-product-api',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          void productApi(request, response, next);
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          void productApi(request, response, next);
        });
      },
    },
  ],
});
