import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: false,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3010",
        changeOrigin: true,
      },
    },
  },
});
