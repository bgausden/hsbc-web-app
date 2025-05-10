// vite.config.js
import {defineConfig} from 'vite';
import {resolve} from 'path';
import legacy from '@vitejs/plugin-legacy';

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
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11'],
        })
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['../test/**/*.spec.{ts,js}']
    }
});
