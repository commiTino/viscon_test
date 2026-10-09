import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    // Codespaces serves the game from a *.app.github.dev URL.
    allowedHosts: true,
  },
});
