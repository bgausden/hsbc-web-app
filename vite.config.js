// vite.config.js
import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
    },
    server: {
        open: true,
        port: 3000
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    css: {
        preprocessorOptions: {
            scss: {
                // Not using additionalData since we import directly in index.scss
            }
        },
        devSourcemap: true
    },
    plugins: [],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['../test/**/*.spec.{ts,js}']
    }
});
