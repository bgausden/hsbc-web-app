// vitest.config.js
import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['test/**/*.spec.{ts,js}'],
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
});
