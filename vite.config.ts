import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: [
        {
          // "@": path.resolve(__dirname, "./src"),
          find: "@",
          replacement: path.resolve(__dirname, "./src"),
        },
      ],
    },
    build: {
      outDir: "build",
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
    },
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
