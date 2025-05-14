
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    https: {}, // Use empty object instead of boolean to enable HTTPS with default settings
  },
  plugins: [
    react(),
    // Remove imagetools plugin to fix sharp dependency issues
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', '*.png', '*.svg'],
      manifest: {
        name: 'Stitch Store',
        short_name: 'Stitch',
        description: 'Produtos oficiais do Stitch da Disney',
        theme_color: '#16a4e8',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          }
        ]
      }
    }),
    mode === 'development' && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          utils: ['./src/utils/dataLayer.ts'],
        },
        // Fix the output paths for CSS and other assets
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]'; // Fixed path for CSS files
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    cssCodeSplit: false, // Keep all CSS in a single file
    sourcemap: true, // Enable sourcemaps for debugging
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: false, // Keep debugger statements for debugging
      }
    },
  },
}));
