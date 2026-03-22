import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    open: true,
    port: 3000,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
    devSourcemap: true,
  },
});
