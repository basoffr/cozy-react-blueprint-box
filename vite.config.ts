
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// Import node built-ins for better control over externals
import { builtinModules } from 'module';

// https://vitejs.dev/config/
// List of packages that might use eval() or new Function() internally
const evalUsingPackages = [
  'ws',
  'bufferutil', 
  'utf-8-validate',
  'sockjs-client',
  'livereload',
  'engine.io-client',
  'socket.io-client',
  'socket.io-parser',
  'vite/dist/client',
  'vite/dist/client/client.mjs',
  '@vite/client',
  'webpack',
  'webpack-dev-server',
  'eval-source-map',
  'json-stringify-safe',
];

// List of packages that should be externalized in production
const externalizeInProd = [
  ...evalUsingPackages,
  ...builtinModules,
  ...builtinModules.map(m => `node:${m}`),
];

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // Disable Hot Module Replacement to avoid CSP errors related to eval() and new Function()
    // This prevents "script-src" CSP violations in the browser
    hmr: false,
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Remove /api prefix when forwarding to Flask
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    // Ensure minification doesn't introduce eval or new Function
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: 'esbuild',
    // Disable code-splitting for better CSP compatibility
    cssCodeSplit: true,
    // Completely disable dynamic imports which can sometimes lead to eval usage
    dynamicImportVarsOptions: {
      warnOnError: true,
      exclude: []
    },
    // Exclude WebSocket and other eval-using packages from the production bundle
    rollupOptions: {
      external: externalizeInProd,
      output: {
        // Ensure no eval-using code gets into the final bundle
        format: 'es',
        generatedCode: {
          // Prevent any dynamic code generation
          constBindings: true,
          objectShorthand: true,
          // Avoid Function constructor usage
          arrowFunctions: true,
          // Avoid eval-like constructs
          reservedNamesAsProps: true,
        },
        // Ensure external packages are properly marked as external
        manualChunks: (id) => {
          // Identify and isolate any potentially problematic modules
          if (evalUsingPackages.some(pkg => id.includes(pkg))) {
            return 'excluded-eval-risk';
          }
          
          // Separate WebSocket related code
          if (id.includes('ws') || id.includes('socket') || id.includes('websocket')) {
            return 'websockets';
          }
          
          // Isolate HMR/dev-only code
          if (id.includes('hmr') || id.includes('hot') || id.includes('/vite/dist/client')) {
            return 'hmr-client';
          }
        }
      }
    },
  },
  
  // Prevent problematic packages from being included in the development bundle
  optimizeDeps: {
    exclude: evalUsingPackages,
    // Force esbuild to process these dependencies to avoid eval usage
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query'
    ],
    // Ensure esbuild doesn't introduce eval
    esbuildOptions: {
      target: 'es2015',
      supported: { 'dynamic-import': false },
      define: {
        eval: 'undefined',
        Function: 'undefined'
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
}));
