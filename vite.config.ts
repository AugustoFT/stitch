
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
    react(),
    imagetools({
      include: ['**/*.{jpeg,jpg,png,webp}'],
      defaultDirectives: new URLSearchParams([
        ['format', 'webp'],
        ['quality', mode === 'production' ? '75' : '80'], // Reduzir qualidade em produção
        ['width', '800'], // Limitar largura máxima
        ['progressive', ''] // Ativar carregamento progressivo
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
          },
          {
            src: '/lovable-uploads/ab25fdf7-5c56-4558-96da-9754bee039be.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/ab25fdf7-5c56-4558-96da-9754bee039be.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        display_override: ['standalone', 'fullscreen'],
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#16a4e8',
        prefer_related_applications: false
      },
      workbox: {
        // Estratégias de cache otimizadas para mobile
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
              cacheableResponse: {
                statuses: [0, 200]
              }
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
              cacheableResponse: {
                statuses: [0, 200]
              }
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
              cacheableResponse: {
                statuses: [0, 200]
              }
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
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
        ],
        // Pré-carregamento de recursos críticos
        navigationPreload: true,
        // Estratégia de fallback para offline
        offlineGoogleAnalytics: true,
        skipWaiting: true,
        clientsClaim: true
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
          // Chunking específico para mobile
          critical: ['./src/hooks/use-mobile.tsx', './src/components/MobileOptimizedImage.tsx'],
        },
        // Simplificando a estrutura de diretórios para evitar paths incorretos
        chunkFileNames: '[name].[hash].js',
        entryFileNames: '[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg|webp)$/.test(name ?? '')) {
            return 'images/[name].[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
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
        ecma: 2020
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    // Target modern browsers for smaller bundle size
    target: 'es2020',
    // Otimização para mobile
    assetsInlineLimit: 4096, // Inline arquivos pequenos (< 4kb)
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'react-router-dom'],
    exclude: ['vite-plugin-pwa/vue', 'vite-plugin-pwa/info'],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true
      }
    }
  },
  // Configuração específica para melhorar carregamento em 3G
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js' && /\.(png|jpe?g|gif|svg|webp)$/.test(filename)) {
        // Use URLs relativas para recursos de imagem em JS
        return { relative: true };
      }
      return filename;
    }
  }
}));
