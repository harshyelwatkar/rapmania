import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default async function getConfig() {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ];

  // Only load cartographer if not in production & REPL_ID is defined
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return defineConfig({
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port: 3000,  // Set the frontend port here (3000 or another available port)
      proxy: {
        '/api': {
          target: 'http://localhost:5001',  // Backend API port
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
}
