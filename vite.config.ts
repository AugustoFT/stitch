
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    https: {}, // Use empty object instead of boolean to enable HTTPS with default settings
  },
  plugins: [
    react({
      // Enable fast refresh
      swcPlugins: [
        ['swc-plugin-react-remove-props', { props: ['data-testid'] }]
      ]
    }),
    imagetools({
      include: ['**/*.{jpeg,jpg,png,webp}'],
      defaultDirectives: new URLSearchParams([
        ['format', 'webp'],
        ['quality', '80']
      ])
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', '*.png', '*.svg', '*.webp'],
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
      },
      workbox: {
        // Cache images for 30 days
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
        ],
      }
    }),
    mode === 'development' && componentTagger(),
    mode === 'production' && visualizer({ filename: 'stats.html' })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps for production to help debugging
    sourcemap: mode === 'development',
    // Optimize build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          framer: ['framer-motion'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
          utils: ['./src/utils/dataLayer.ts'],
          components: ['./src/components/ui/button.tsx', './src/components/ui/card.tsx'],
        },
        // Minimize JS chunk size
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    cssCodeSplit: true,
    // Enable these for better performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        passes: 2,
      },
      mangle: true,
    },
    // Target modern browsers for smaller bundle size
    target: 'es2020',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'react-router-dom'],
    exclude: ['vite-plugin-pwa/vue', 'vite-plugin-pwa/info'],
    esbuildOptions: {
      target: 'es2020',
    }
  },
}));
