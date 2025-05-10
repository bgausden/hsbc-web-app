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
        port: 3000,
        // Set CORS headers and security headers in development
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            // Lighter CSP for development, but still secure
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:;"
        },
        // Additional security settings
        hmr: {
            // More secure WebSocket connections
            protocol: 'ws',
            clientPort: 3000
        }
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
