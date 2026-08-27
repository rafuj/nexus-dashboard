import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in current working directory
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: {
          svgoConfig: {
            plugins: [{ name: "cleanupIds", active: true }],
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // Intercept requests starting with /api and forward to the target in .env
        "/api": {
          target: env.VITE_API_URL, // Uses "https://staging.updaid.com" from .env
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      }
    },
  }
})