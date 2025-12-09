import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: "Nova Cloud Stack Tool's",
        short_name: "Nova Tools",
        description: "Professional developer tools made simple and accessible",
        theme_color: "#2563eb",
        background_color: "#111827",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        categories: ["developer", "utilities", "productivity"],
        shortcuts: [
          {
            name: "Hash Generator",
            short_name: "Hash",
            description: "Generate hash values",
            url: "/#hash",
            icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
          },
          {
            name: "UUID Generator",
            short_name: "UUID",
            description: "Generate UUIDs",
            url: "/#uuid",
            icons: [{ src: "/icon-192x192.png", sizes: "192x192" }]
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      devOptions: {
        enabled: false,
        type: 'module'
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            // React and React DOM
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Firebase modules
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            // UI icons library
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }
          // Split large tool components
          if (id.includes('/components/Tools/')) {
            const toolName = id.split('/components/Tools/')[1]?.split('.')[0];
            if (toolName) {
              return `tool-${toolName}`;
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,
    strictPort: false,
    open: true,
  },
  preview: {
    host: 'localhost',
    port: 4173,
    strictPort: false,
  },
});
