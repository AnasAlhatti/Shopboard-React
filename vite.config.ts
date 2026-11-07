import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { productApi } from './server/productApi.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
