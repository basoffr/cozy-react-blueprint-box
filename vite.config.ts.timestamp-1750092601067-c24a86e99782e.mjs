// vite.config.ts
import { defineConfig } from "file:///C:/Users/basof/Documents/cozy-react-blueprint-box/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/basof/Documents/cozy-react-blueprint-box/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/basof/Documents/cozy-react-blueprint-box/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\basof\\Documents\\cozy-react-blueprint-box";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    // Disable Hot Module Replacement to avoid CSP errors related to eval() and new Function()
    // This prevents "script-src" CSP violations in the browser
    hmr: false,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, "")
        // keep single /api
      }
    }
  },
  build: {
    sourcemap: true,
    outDir: "dist",
    // Ensure minification doesn't introduce eval or new Function
    minify: "esbuild",
    target: "es2015",
    cssMinify: "esbuild",
    // Disable code-splitting for better CSP compatibility
    cssCodeSplit: true,
    // Exclude WebSocket and other eval-using packages from the production bundle
    rollupOptions: {
      external: ["ws", "bufferutil", "utf-8-validate"],
      output: {
        // Ensure external packages are properly marked as external
        manualChunks: (id) => {
          if (id.includes("ws") || id.includes("socket")) {
            return "websockets";
          }
        }
      }
    }
  },
  // Prevent problematic packages from being included in the development bundle
  optimizeDeps: {
    exclude: ["ws", "bufferutil", "utf-8-validate"]
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxiYXNvZlxcXFxEb2N1bWVudHNcXFxcY296eS1yZWFjdC1ibHVlcHJpbnQtYm94XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxiYXNvZlxcXFxEb2N1bWVudHNcXFxcY296eS1yZWFjdC1ibHVlcHJpbnQtYm94XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9iYXNvZi9Eb2N1bWVudHMvY296eS1yZWFjdC1ibHVlcHJpbnQtYm94L3ZpdGUuY29uZmlnLnRzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICAvLyBEaXNhYmxlIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgdG8gYXZvaWQgQ1NQIGVycm9ycyByZWxhdGVkIHRvIGV2YWwoKSBhbmQgbmV3IEZ1bmN0aW9uKClcbiAgICAvLyBUaGlzIHByZXZlbnRzIFwic2NyaXB0LXNyY1wiIENTUCB2aW9sYXRpb25zIGluIHRoZSBicm93c2VyXG4gICAgaG1yOiBmYWxzZSxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6NTAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogcCA9PiBwLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksICAvLyBrZWVwIHNpbmdsZSAvYXBpXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIC8vIEVuc3VyZSBtaW5pZmljYXRpb24gZG9lc24ndCBpbnRyb2R1Y2UgZXZhbCBvciBuZXcgRnVuY3Rpb25cbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgIGNzc01pbmlmeTogJ2VzYnVpbGQnLFxuICAgIC8vIERpc2FibGUgY29kZS1zcGxpdHRpbmcgZm9yIGJldHRlciBDU1AgY29tcGF0aWJpbGl0eVxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICAvLyBFeGNsdWRlIFdlYlNvY2tldCBhbmQgb3RoZXIgZXZhbC11c2luZyBwYWNrYWdlcyBmcm9tIHRoZSBwcm9kdWN0aW9uIGJ1bmRsZVxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ3dzJywgJ2J1ZmZlcnV0aWwnLCAndXRmLTgtdmFsaWRhdGUnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBFbnN1cmUgZXh0ZXJuYWwgcGFja2FnZXMgYXJlIHByb3Blcmx5IG1hcmtlZCBhcyBleHRlcm5hbFxuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIC8vIFNlcGFyYXRlIGFueSBXZWJTb2NrZXQgcmVsYXRlZCBjb2RlIGludG8gaXRzIG93biBjaHVuayB0aGF0IGNhbiBiZSBleGNsdWRlZFxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnd3MnKSB8fCBpZC5pbmNsdWRlcygnc29ja2V0JykpIHtcbiAgICAgICAgICAgIHJldHVybiAnd2Vic29ja2V0cyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbiAgXG4gIC8vIFByZXZlbnQgcHJvYmxlbWF0aWMgcGFja2FnZXMgZnJvbSBiZWluZyBpbmNsdWRlZCBpbiB0aGUgZGV2ZWxvcG1lbnQgYnVuZGxlXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnd3MnLCAnYnVmZmVydXRpbCcsICd1dGYtOC12YWxpZGF0ZSddXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0L3NldHVwLnRzJ10sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUpoQyxJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFHTixLQUFLO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLE9BQUssRUFBRSxRQUFRLFVBQVUsRUFBRTtBQUFBO0FBQUEsTUFDdEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBO0FBQUEsSUFFUixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUE7QUFBQSxJQUVYLGNBQWM7QUFBQTtBQUFBLElBRWQsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLE1BQU0sY0FBYyxnQkFBZ0I7QUFBQSxNQUMvQyxRQUFRO0FBQUE7QUFBQSxRQUVOLGNBQWMsQ0FBQyxPQUFPO0FBRXBCLGNBQUksR0FBRyxTQUFTLElBQUksS0FBSyxHQUFHLFNBQVMsUUFBUSxHQUFHO0FBQzlDLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLE1BQU0sY0FBYyxnQkFBZ0I7QUFBQSxFQUNoRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyxxQkFBcUI7QUFBQSxFQUNwQztBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
