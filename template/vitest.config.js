import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.js',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json'],
            exclude: [
                'node_modules/',
                'src/tests/',
                '**/*.config.js',
                '**/index.js',
                'src/main.jsx',
                'src/design/**',
                'dist/',
            ],
            lines: 80,
            functions: 80,
            branches: 70,
            statements: 80,
        },
        include: ['src/**/*.{test,spec}.{js,jsx}'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
